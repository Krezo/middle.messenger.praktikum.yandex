import { ReactNode } from 'react'
import { ChildrendVNode, IVNode, VNodeProps } from './vdom'

export interface IComponentProps {
  children?: any | IVNode[]
  className?: string
}

export interface IComponentVNode {
  tagName: (props: VNodeProps, children: (IVNode | string)[]) => IVNode
  props: VNodeProps
  children: ChildrendVNode
}

export const isComponentNode = (
  data: IVNode | IComponentVNode
): data is IComponentVNode => {
  return typeof data.tagName === 'function'
}

export const createComponentNode = (
  tagName: (props: VNodeProps, children: (IVNode | string)[]) => IVNode,
  props: VNodeProps,
  children: ChildrendVNode
): IComponentVNode => {
  return {
    tagName,
    props,
    children,
  }
}
