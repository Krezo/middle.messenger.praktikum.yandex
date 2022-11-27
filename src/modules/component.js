import { createVNode, templateToVNode } from './vdom';
import utils from "../utils/utils";
export default class Component {
  $app;
  // Самозакрывающийс элемент
  SELF_CLOSE_TAG_REGEXP = /<\w+\s*([^>]*)\/>/gi;
  // Разбор шаблона на элементы
  PARSE_HTML_TEMPLATE_REGEXP = /<\/?(\w+)\s*([^>]*?)\/?>|[^<>]+/gi

  constructor(renderFunc, state = {}, props = {}) {
    this.renderFunc = renderFunc;
    this.props = props;
    this.components = [];
    // Пока не знаю как реализовать реактивность для перестройки VDOM
    this.state = new Proxy(state, {
      set: (target, prop, value) => {
        if (prop in target) {
          target[prop] = value;
          this.render();
          this.$app.remount();
        }
      }
    });
    this.vnode = null;
  }
  // Регистрация компонентов
  register(componentName, component) {
    this.components[componentName] = component;
    component.$app = this.$app;
  }
  // Проверка существования шаблона по имени тега
  renderComponentExist(componentName) {
    if (this.$app) {
      if (componentName in this.$app.components) {
        return this.$app.components[componentName];
      }
    }
    if (componentName in this.components) {
      return this.components[componentName];
    }
  }
  // Рендер шаблона
  render(props, children) {
    // Объеднием пропсы по умолчанию с переданными в компонент пропсами
    const finalProps = {
      ...this.props,
      ...props,
    }
    // Устанавливает контекст
    const ctx = { ...this.state, props: finalProps };
    // Вызываем reander функцию компонента
    const renderFuncResult = this.renderFunc(finalProps);
    if (!renderFuncResult) return null;
    // Экстраполируем переменные
    const template = this._intropolateTemplate(renderFuncResult, ctx)
    // Массив для сборки Virtual DOM
    const nodeList = [...template.matchAll(this.PARSE_HTML_TEMPLATE_REGEXP)];
    // Очищаем пустые/ненужные для построения Virtual DOM элементы
    const deleteNodeListIndexes = [];
    for (let i = 0; i < nodeList.length; i++) {
      if (!/[^\s]+/.test(nodeList[i][0])) deleteNodeListIndexes.push(i);
    }
    deleteNodeListIndexes.reverse().map(index => {
      nodeList.splice(index, 1)
    });
    // Рекурсивно строим Virtual DOM
    this.vnode = this._templateToVnodeDo(nodeList, template, children, ctx);
    // Возврашаем корень Virtual DOM дерева
    return this.vnode;
  }
  // Извлекаем html атрибуты и значения из текста
  _attrsToObject(str) {
    if (str == '') return {};
    const htmlAtrRegexp = /([\w:]+)=?\"\s*([^"]*)\s*\"|(\w+)/gi;
    const props = {};
    for (const [singleAttrName, attrName, attrValue, isSingleAttr] of [...str.matchAll(htmlAtrRegexp)]) {
      if (isSingleAttr) props[singleAttrName] = ''
      else props[attrName] = attrValue;
    }
    return props;
  }
  // Создание Virtual DOM используя текстовый шаблон
  _templateToVnodeDo(vNodeArray, template, componentChildren, ctx) {
    if (!Array.isArray(vNodeArray)) return vNodeArray;
    for (let i = 0; i < vNodeArray.length; i++) {
      if (!Array.isArray(vNodeArray[i])) continue;
      if (this.SELF_CLOSE_TAG_REGEXP.test(vNodeArray[i][0])) {
        const tagName = vNodeArray[i][1];
        const props = this._attrsToObject(vNodeArray[i][2]);
        const componentTag = this.renderComponentExist(tagName);
        vNodeArray[i] = componentTag ? componentTag.render(props) : createVNode(tagName, props)
        this._templateToVnodeDo(vNodeArray, template, [], ctx);
      } else if (/<\//.test(vNodeArray[i][0])) {
        const tagName = vNodeArray[i][1].trim();
        let props = {};
        const deletedIndex = [i];
        const children = [];
        for (let j = i - 1; j >= 0; j--) {
          if (!Array.isArray(vNodeArray[j]) || !/[<>]/.test(vNodeArray[j][0])) {
            const isTextNode = !/[<>]/.test(vNodeArray[j][0]) && vNodeArray[j][0];
            children.unshift(isTextNode ? (typeof vNodeArray[j] === 'string') ? vNodeArray[j] : vNodeArray[j][0] : vNodeArray[j])
            deletedIndex.push(j);
          } else {
            props = this._attrsToObject(vNodeArray[j][2]);
            break;
          };
        }
        const componentTag = this.renderComponentExist(tagName);
        if (tagName == 'slot') {
          vNodeArray.splice(i - 1, 2, ...componentChildren)
        } else {
          vNodeArray[i - deletedIndex.length] = componentTag ? componentTag.render(props, children) : createVNode(tagName, props, children);
          deletedIndex.map(dIndex => vNodeArray.splice(dIndex, 1));
          if (':for' in props) {
            const [leftExpression, rightExpression] = props[':for'].replace(/\s+/g, ' ').split(/\s+in\s+/)
            const rightExpressionValue = utils.get(ctx, rightExpression)
            if (!leftExpression || !rightExpression) throw new Error('Неправильное выражение :for');
            if (!rightExpressionValue) throw new Error('Неправильное выражение :for');
            if (children.length !== 1) throw new Error(':for должен именить одного родителя');
            const forRootCopyString = JSON.stringify(children[0]);
            let index = 0;
            for (const rigthExpressionItem in rightExpressionValue) {
              const forRootCopy = JSON.parse(forRootCopyString);
              this._intropolateVNode(forRootCopy, Object.assign(ctx, { [leftExpression]: rigthExpressionItem }), leftExpression, rightExpression, index);
              index++;
              children.push(forRootCopy);
            }
            children.shift();
          }
        }
        this._templateToVnodeDo(vNodeArray, template, componentChildren, ctx);
      }

    }
    if (vNodeArray.every(vNode => Array.isArray(vNode))) {
      this._templateToVnodeDo(vNodeArray, template);
    } else if (vNodeArray.length !== 1) throw new Error('В компоненте должен быть родительский элемент!')
    return vNodeArray[0];
  }
  // Интрополрием переменные в шаблоне (текст) используя контекст
  _intropolateTemplate = (template, ctx) => {
    // Экстраполяция переменных
    const TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;
    let _template = template;
    [..._template.matchAll(TEMPLATE_REGEXP)].map((key) => {
      if (key[1]) {
        const getItem = utils.get(ctx, key[1].trim());
        if (getItem) _template = _template.replace(key[0], getItem)
      }
    });
    return _template;
  }
  // Интерполяция для циклов
  _interpolateFor = (template, itemName, itemCtx, index) => {
    // Ищем вхождение {{itemName...}} в шаблоне
    const interpolateRegexp = new RegExp(`\{\{(${itemName}.*)\}\}`, "gi");
    let _template = template;
    [...template.matchAll(interpolateRegexp)].map(key => {
      // Делаем замену в найденом выражениее на {{itemCtx[index]...}}
      const replaceTo = key[0].replace(itemName, `${itemCtx}[${index}]`)
      //Меняем {{itemName...}} на {{itemCtx[index]...}} для интерполяции переменной из контекста
      _template = _template.replace(key[0], replaceTo);
    });
    return _template;
  }
  // Интрополрием переменные в виртуальном DOMe используя контекст
  // Пока только текстовые ноды
  _intropolateVNode = (root, ctx, itemName, itemCtx, index) => {
    const rootChildren = root.children;
    // Ищем текстовые ноды в VDOM
    for (let i = 0; i < rootChildren.length; i++) {
      if (typeof rootChildren[i] === 'string') {
        // Меняем itemName на itemCtx[index]
        const interpolateForTemplate = this._interpolateFor(rootChildren[i], itemName, itemCtx, index);
        // Делаем интерполяцию переменных на основе контекста
        rootChildren[i] = this._intropolateTemplate(interpolateForTemplate, ctx);
      }
      if (rootChildren[i].children?.length) this._intropolateVNode(rootChildren[i], ctx, itemName, itemCtx, index)
    }
  }
}