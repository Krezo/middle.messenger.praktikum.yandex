import { ChildrendVNode, IVNode, VNodeProps } from './vdom'

export interface IComponentProps {
  children?: any | IVNode[]
  className?: string
}

export interface IOnMountedHook {
  (component: ILifeCycleComponent): void
}

export interface IOnUpdateHook<T> {
  (component: ILifeCycleComponent, oldProps: T, newProps: T): void
}

let lifeCycleRegister = false

// Стек хуков
export const hookOnUpdateStack: (IOnUpdateHook<VNodeProps> | null)[] = []
export const hookOnMountedStack: (IOnMountedHook | null)[] = []

export const clearHooksStack = () => {
  hookOnUpdateStack.splice(0)
  hookOnMountedStack.splice(0)
}

export const startListenHooks = () => {
  hookOnUpdateStack.push(null)
  hookOnMountedStack.push(null)
  lifeCycleRegister = true
}

export const getHooks = () => ({
  onUpdate: hookOnUpdateStack.pop() || null,
  onMounted: hookOnMountedStack.pop() || null,
})

export const endListenHooks = () => {
  lifeCycleRegister = false
}

const isLifeCycleRegisterEnable = () => lifeCycleRegister

export const registerLifeCycleHooks = (
  component: IComponentVNode,
  hooks: IComponentLifeCycleHooks
) => {
  Object.assign(component, hooks)
}

export const clearLifeCycleHooks = () => {
  for (const key in componentLifecycleHooks) {
    componentLifecycleHooks[key as keyof typeof componentLifecycleHooks] = null
  }
}

export interface IComponentLifeCycleHooks {
  onMounted: IOnMountedHook | null
  onUpdate: IOnUpdateHook<VNodeProps> | null
}

export const componentLifecycleHooks: IComponentLifeCycleHooks = {
  onMounted: null,
  onUpdate: null,
}
export interface IComponentVNode extends IComponentLifeCycleHooks {
  tagName: (props: VNodeProps, children: (IVNode | string)[]) => IVNode
  props: VNodeProps
  children: ChildrendVNode
  domNode?: Node
}

export interface ILifeCycleComponent extends IComponentVNode {
  domNode: Node
}

export const isComponentNode = (
  data: IVNode | IComponentVNode
): data is IComponentVNode => typeof data.tagName === 'function'

export const onMounted = (onMountedFunc: IOnMountedHook) => {
  if (!isLifeCycleRegisterEnable) return
  hookOnMountedStack.pop()
  hookOnMountedStack.push(onMountedFunc)
}

export const onUpdate = <T>(onUpdateFunc: IOnUpdateHook<T>) => {
  if (!isLifeCycleRegisterEnable) return
  hookOnUpdateStack.pop()
  hookOnUpdateStack.push(onUpdateFunc as IOnUpdateHook<VNodeProps>)
}

export const createComponentNode = (
  tagName: (props: VNodeProps, children: (IVNode | string)[]) => IVNode,
  props: VNodeProps,
  children: ChildrendVNode
): IComponentVNode => ({
  tagName,
  props,
  children,
  ...componentLifecycleHooks,
})
