/* eslint-disable no-restricted-syntax */
import {
  IComponentVNode,
  ILifeCycleComponent,
  clearHooksStack,
  isComponentNode,
} from './components'
import h from './h'

import { computed, watch } from './reactivity'

export type ChildrendVNode = IVNode | any
export type VNodeProps = Record<string, any>

export interface IVNode {
  tagName: string
  props: VNodeProps
  children: ChildrendVNode[]
}

export const createVNode = (
  tagName: string,
  props: VNodeProps,
  children: ChildrendVNode[]
) => ({
  tagName,
  props,
  children: children.flat(),
})

// Тут не весь список
// Полный список https://developer.mozilla.org/en-US/docs/Web/SVG/Element#svg_elements_a_to_z
const isSvg = (node: IVNode | IComponentVNode) =>
  node.tagName === 'svg' ||
  node.tagName === 'line' ||
  node.tagName === 'polygon' ||
  node.tagName === 'path'

const renderDOM = (
  root:
    | IVNode
    | IComponentVNode
    | JSX.Element
    | string
    | number
    | boolean
    | null,
  component?: IComponentVNode
): Node => {
  // Нод условного рендера
  if (typeof root === 'boolean') {
    // Добавляем в vdom комментарий для слежения последовательности
    // условного рендера
    return document.createComment('if')
  }
  if (typeof root === 'string') {
    return document.createTextNode(root)
  }

  if (typeof root === 'number') {
    return document.createTextNode(root.toString())
  }

  if (root === null) {
    return document.createTextNode('')
  }

  let domRoot: HTMLElement | SVGElement

  // JXS.Element нужен для совместимости, избавляемся от него
  const notJXSRoot = root as IVNode | IComponentVNode

  if (isComponentNode(notJXSRoot)) {
    if (!notJXSRoot.domNode) {
      return renderDOM(notJXSRoot.children[0], notJXSRoot)
    }
    return renderDOM(notJXSRoot.children[0])
  }

  if (isSvg(notJXSRoot)) {
    domRoot = document.createElementNS(
      'http://www.w3.org/2000/svg',
      notJXSRoot.tagName
    )
  } else {
    domRoot = document.createElement(notJXSRoot.tagName)
  }

  for (const propName in root.props) {
    if (propName.startsWith('on')) {
      domRoot.addEventListener(
        propName.replace('on', '').toLocaleLowerCase(),
        notJXSRoot.props[propName]
      )
      continue
    }
    if (!notJXSRoot.props[propName]) continue
    if (isInputElement(notJXSRoot) && propName === 'value') {
      ;(domRoot as HTMLInputElement).value = notJXSRoot.props[propName]
    } else if (propName === 'className') {
      domRoot.setAttribute(
        'class',
        (notJXSRoot.props[propName] as string)
          .split(' ')
          .filter((v) => !!v)
          .join(' ')
      )
    } else if (propName === 'children') {
    } else domRoot.setAttribute(propName, notJXSRoot.props[propName])
  }

  notJXSRoot.children.forEach((child) => {
    domRoot.appendChild(renderDOM(child))
  })

  if (component) {
    component.domNode = domRoot
    if (component.onMounted) {
      component.onMounted(component as ILifeCycleComponent)
    }
  }
  return domRoot
}

const patchNode = (
  node: HTMLElement,
  vNode: any,
  nextVNode: any,
  component?: ILifeCycleComponent,
  nextComponent?: ILifeCycleComponent,
  componentOldProps?: VNodeProps,
  componentNewProps?: VNodeProps
) => {
  // Пропускам обновление условного рендера
  if (vNode === false && nextVNode === false) {
    return
  }
  // Удаляем ноду, если значение nextVNode не задано
  if (nextVNode === undefined) {
    node.remove()
    return
  }

  if (
    typeof nextVNode === 'string' ||
    typeof nextVNode === 'number' ||
    vNode === null ||
    nextVNode === null
  ) {
    // Заменяем ноду на новую, если как минимум одно из значений равно строке
    // и эти значения не равны друг другу
    if (vNode !== nextVNode && nextVNode !== null) {
      const nextNode = renderDOM(nextVNode.toString())
      node.replaceWith(nextNode)
      return nextNode
    }

    // Если два значения - это строки и они равны,
    // просто возвращаем текущую ноду
    return node
  }

  const vNodeIsComponentNode = isComponentNode(vNode)
  const nextVNodeComponentNode = isComponentNode(nextVNode)
  // const canUpdateComponent = vNodeIsComponentNode && nextVNodeComponentNode

  if (vNodeIsComponentNode && nextVNodeComponentNode) {
    patchNode(
      node,
      vNode.children[0],
      nextVNode.children[0],
      vNode as ILifeCycleComponent,
      nextVNode as ILifeCycleComponent,
      vNode.props,
      nextVNode.props
    )
    return
  }

  if (vNodeIsComponentNode) {
    patchNode(
      node,
      vNode.children[0],
      nextVNode,
      nextVNode as ILifeCycleComponent
    )
    return
  }

  if (nextVNodeComponentNode) {
    patchNode(
      node,
      vNode,
      nextVNode.children[0],
      nextVNode as ILifeCycleComponent
    )
    return
  }

  // Заменяем ноду на новую, если теги не равны
  if (vNode?.tagName !== nextVNode?.tagName) {
    const nextNode = renderDOM(nextVNode)
    node.replaceWith(nextNode)
    return nextNode
  }

  // Патчим свойства (реализация будет далее)
  patchProps(node, vNode.props, nextVNode.props)

  // Патчим детей (реализация будет далее)
  patchChildren(node, vNode.children, nextVNode.children)

  if (component && nextComponent && componentOldProps) {
    if (component.onUpdate) {
      // Передаем ноду, иначе при след. вызовах теряем
      nextComponent.domNode = component.domNode
      component.onUpdate(
        nextComponent,
        componentOldProps,
        componentNewProps || {}
      )
    }
  }

  // Возвращаем обновленный DOM-элемент
  return node
}

const isInputElement = (node: HTMLElement | IVNode) =>
  node.tagName === 'INPUT' || node.tagName === 'TEXTAREA'

const patchProp = (
  node: HTMLElement,
  key: string,
  value: any,
  nextValue: any
) => {
  // Если новое значение не задано, то удаляем атрибут
  if (typeof value === 'function') {
    const eventKey = key.replace('on', '').toLowerCase()
    if (!nextValue) {
      node.removeEventListener(eventKey, value)
    } else if (value !== nextValue) {
      node.removeEventListener(eventKey, value)
      node.addEventListener(eventKey, nextValue)
    }
    return
  }

  if (isInputElement(node) && key === 'value') {
    // debugger
    ;(node as HTMLInputElement).value = nextValue
    return
  }
  if (nextValue == null || nextValue === false) {
    node.removeAttribute(key)
    return
  }
  // Устанавливаем новое значение атрибута
  // Для className DOM атрибут class
  if (key === 'className') {
    node.setAttribute('class', nextValue)
  } else {
    node.setAttribute(key, nextValue)
  }
}

const patchProps = (node: HTMLElement, props: any, nextProps: any) => {
  const _nextProps = nextProps ?? {}
  let diffPropsCount = 0

  // Объект с общими свойствами
  const mergedProps = { ...props, ..._nextProps }
  Object.keys(mergedProps).forEach((key) => {
    // Если значение не изменилось, то ничего не обновляем
    if (props[key] !== _nextProps[key]) {
      if (typeof props[key] !== 'function') {
        diffPropsCount++
      }
      patchProp(node, key, props[key], _nextProps[key])
    }
  })
  return diffPropsCount > 0
}

const patchChildren = (
  parent: HTMLElement,
  vChildren: IVNode[],
  nextVChildren: IVNode[]
) => {
  // Создаем копию элементов родителя и передаем их в patchNode
  ;[...Array.from(parent.childNodes)].forEach((childNode, i) => {
    patchNode(childNode as HTMLElement, vChildren[i], nextVChildren[i])
  })
  // Проверяем что передали массив
  if (!Array.isArray(nextVChildren)) {
    return
  }
  nextVChildren.slice(vChildren.length).forEach((vChild) => {
    parent.appendChild(renderDOM(vChild))
  })
}

const mount = (target: HTMLElement, node: HTMLElement) => {
  target.replaceWith(node)
  return node
}

const createApp = (
  root: HTMLElement | null,
  vnodeRoot: () => IVNode | JSX.Element
) => {
  // vnodeRoot всегда возвращает IVNode, JSX.Element чтобы не было ошибок при работе с JXS
  const rootVDOM = computed(() => vnodeRoot() as IVNode)

  return {
    mount: () => {
      if (!root) return

      const renderResult = rootVDOM

      // Монтируем VDOM в DOM
      const rootDOM = mount(root, renderDOM(renderResult.value) as HTMLElement)

      // Обновляем DOM
      watch(
        () => rootVDOM.value,
        (newVTree, oldVTree) => {
          clearHooksStack()
          patchNode(rootDOM, oldVTree, newVTree)
        }
      )
    },
  }
}

export { mount, patchNode, renderDOM, createApp, h }
