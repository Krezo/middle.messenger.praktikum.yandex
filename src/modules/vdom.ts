import { IObserver } from './observer';
import { computed, render, setRootRenderFunc, watch } from './reactivity';

export interface IVNode {
  tagName: string,
  props: Record<string, any>,
  children: (IVNode | string)[]
}

const h = (tagName: (...params: any[]) => void | string, props: {} = {}, ...children: (IVNode | string)[]) => {

  if (typeof tagName === "function") {
    return tagName({ ...props, ...{ children } }, children);
  }

  const el = {
    tagName,
    props,
    children: children.flat(),
  }

  return el
}

const renderDOM = (root: IVNode | string | number) => {
  if (typeof root === 'string') {
    return document.createTextNode(root)
  }
  if (typeof root === 'number') {
    return document.createTextNode(root.toString())
  }

  let domRoot: HTMLElement | SVGSVGElement | SVGLineElement | SVGPolygonElement;

  if (root.tagName === 'svg' || root.tagName === 'line' || root.tagName === 'polygon') {
    domRoot = document.createElementNS("http://www.w3.org/2000/svg", root.tagName)
  } else
    domRoot = document.createElement(root.tagName);

  for (const propName in root.props) {
    if (propName.startsWith('on')) {
      domRoot.addEventListener(propName.replace('on', '').toLocaleLowerCase(), root.props[propName])
      continue
    }
    if (!root.props[propName]) continue;
    if (root.tagName === 'input' && propName === 'value') {
      (domRoot as HTMLInputElement).value = propName, root.props[propName]
    }
    else if (propName === 'className') {
      domRoot.setAttribute('class', root.props[propName])
    }
    else if (propName === 'children') { }
    else domRoot.setAttribute(propName, root.props[propName])
  }
  root.children.forEach(child => {
    if (!child) return;
    domRoot.appendChild(renderDOM(child))
  })
  return domRoot;
}

const patchNode = (node: HTMLElement, vNode: any, nextVNode: any) => {
  // Удаляем ноду, если значение nextVNode не задано
  if (nextVNode === undefined) {
    node.remove();
    return;
  }

  if (typeof vNode === "string" || typeof nextVNode === "string") {
    // Заменяем ноду на новую, если как минимум одно из значений равно строке
    // и эти значения не равны друг другу
    if (vNode !== nextVNode) {
      const nextNode = renderDOM(nextVNode);
      node.replaceWith(nextNode);
      return nextNode;
    }

    // Если два значения - это строки и они равны,
    // просто возвращаем текущую ноду
    return node;
  }

  // Заменяем ноду на новую, если теги не равны
  if (vNode.tagName !== nextVNode.tagName) {
    const nextNode = renderDOM(nextVNode);
    node.replaceWith(nextNode);
    return nextNode;
  }

  // Патчим свойства (реализация будет далее)
  patchProps(node, vNode.props, nextVNode.props);

  // Патчим детей (реализация будет далее)
  patchChildren(node, vNode.children, nextVNode.children);

  // Возвращаем обновленный DOM-элемент
  return node;
};

const patchProp = (node: HTMLElement, key: any, value: any, nextValue: any) => {
  // Если новое значение не задано, то удаляем атрибут
  if (typeof value === 'function') {
    if (!nextValue) node.removeEventListener(key.replace('on'), value)
    return;
  }
  if (node.tagName === 'INPUT' && key === 'value') {
    (node as HTMLInputElement).value = nextValue;
    return;
  }
  if (nextValue == null || nextValue === false) {
    node.removeAttribute(key);
    return;
  }
  // Устанавливаем новое значение атрибута
  // Для className DOM атрибут class
  if (key === 'className') {
    node.setAttribute('class', nextValue);
  } else node.setAttribute(key, nextValue);
};

const patchProps = (node: HTMLElement, props: any, nextProps: any) => {
  const _nextProps = nextProps ?? {};

  // Объект с общими свойствами
  const mergedProps = { ...props, ..._nextProps };
  Object.keys(mergedProps).forEach(key => {
    // Если значение не изменилось, то ничего не обновляем
    if (props[key] !== _nextProps[key]) {
      patchProp(node, key, props[key], _nextProps[key]);
    }
  });

};

const patchChildren = (parent: HTMLElement, vChildren: any, nextVChildren: any) => {

  parent.childNodes.forEach((childNode, i) => {
    patchNode(childNode as HTMLElement, vChildren[i], nextVChildren[i]);
  });

  nextVChildren.slice(vChildren.length).forEach(vChild => {
    parent.appendChild(renderDOM(vChild));
  });
};

const mount = (target: HTMLElement, node: HTMLElement) => {
  target.replaceWith(node);
  return node;
}

const createApp = (root: HTMLElement | null, vnodeRoot: () => IVNode | JSX.Element) => {

  // vnodeRoot всегда возвращает IVNode, JSX.Element чтобы не было ошибок при работе с JXS
  const rootVDOM = computed(() => (vnodeRoot() as IVNode));

  return {
    mount: () => {
      if (!root) return;

      let renderResult = rootVDOM;

      // Монтируем VDOM в DOM
      const rootDOM = mount(root, renderDOM(renderResult.value) as HTMLElement)

      // Обновляем DOM
      watch(() => rootVDOM.value, (newVTree, oldVTree) => {
        patchNode(rootDOM, oldVTree, newVTree)
      })
    }
  }
}

export {
  mount,
  h,
  patchNode,
  renderDOM,
  createApp
}
