import {
  IComponentVNode,
  createComponentNode,
  endListenHooks,
  getHooks,
  registerLifeCycleHooks,
  startListenHooks,
} from './components'
import { ChildrendVNode, IVNode, VNodeProps, createVNode } from './vdom'

const h = (
  tagName: ((props: VNodeProps, children: ChildrendVNode) => IVNode) | string,
  props: VNodeProps = {},
  ...children: ChildrendVNode[]
): IVNode | IComponentVNode => {
  if (typeof tagName === 'function') {
    const componentProps = { ...props, ...{ children } }
    startListenHooks()
    const componentRender = tagName(componentProps, children)
    const hooks = getHooks()
    const component = createComponentNode(tagName, componentProps, [
      componentRender,
    ])
    registerLifeCycleHooks(component, hooks)
    endListenHooks()

    return component
  }
  return createVNode(tagName, props, children)
}

export default h
