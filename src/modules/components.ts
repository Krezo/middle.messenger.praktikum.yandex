import { ReactNode } from 'react';
import { IVNode } from './vdom';

interface IComponentProps {
  children?: ReactNode
  className?: string
}

export {
  IComponentProps
}