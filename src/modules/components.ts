import { ReactNode } from 'react'
import { IVNode } from './vdom'

interface IComponentProps {
  children?: any | IVNode[]
  className?: string
}

export { IComponentProps }
