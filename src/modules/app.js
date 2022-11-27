import Component from './component';
import { createDOMNode } from './vdom';
export default class App {
  layout = null;
  constructor(rootComponent) {
    this.rootComponent = rootComponent;
    this.rootComponent.$app = this;
    this.layoutProps = {};
    this.components = {};
  }
  // Монтирование приложения
  mount(target) {
    target.innerHTML = '';
    const rootComponentRenderVNode = this.rootComponent.render();
    if (this.layout?.component instanceof Component) {
      const layoutRenderVNode = this.layout.component.render(this.layoutProps, [rootComponentRenderVNode])
      target.appendChild(createDOMNode(layoutRenderVNode));
    }
    else target.appendChild(createDOMNode(rootComponentRenderVNode));
  }
  // Установка layout
  setLayout(layoutComponent, layoutProps = {}) {
    this.layout = layoutComponent;
    this.layoutProps = layoutProps;
    this.register(this.layout.name, this.layout.component)
  }
  // Регистрация глобальных компонентов
  register(componentName, component) {
    this.components[componentName] = component;
    component.$app = this;
  }
}