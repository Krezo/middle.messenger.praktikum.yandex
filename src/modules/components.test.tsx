import { createComponentNode } from './components'
import { IVNode, VNodeProps, patchNode, renderDOM } from './vdom'

describe('Component', () => {
  const createMockComponent = (props: VNodeProps = {}) => {
    const mockComponentProps = props
    const mockComponentTagName = (props: typeof mockComponentProps) => {
      // @ts-ignore
      return (<div></div>) as IVNode
    }

    const componenetVNode = createComponentNode(
      mockComponentTagName,
      mockComponentProps,
      [mockComponentTagName(mockComponentProps)]
    )

    return componenetVNode
  }

  test('should have vdom after render dom', () => {
    const component = createMockComponent()
    const componentNode = renderDOM(component)
    expect(component.domNode).toEqual(componentNode)
  })

  test('should call onMounted after render dom', () => {
    const component = createMockComponent()
    const mockOnMounted = jest.fn()
    component.onMounted = mockOnMounted
    renderDOM(component)
    expect(mockOnMounted).toBeCalledTimes(1)
  })

  test('should call onMounted with correct params', () => {
    const component = createMockComponent()
    const mockOnMounted = jest.fn()
    component.onMounted = mockOnMounted
    renderDOM(component)
    expect(mockOnMounted).toBeCalledWith(component)
  })

  test('should call onUpdate after props changes', () => {
    const componentBeforUpdate = createMockComponent({ a: 1 })
    const componentAfterUpdate = createMockComponent({ a: 2 })
    const mockOnUpdate = jest.fn()
    componentBeforUpdate.onUpdate = mockOnUpdate
    patchNode(
      renderDOM(componentAfterUpdate) as HTMLElement,
      componentBeforUpdate,
      componentAfterUpdate
    )
    expect(mockOnUpdate).toBeCalledTimes(1)
  })

  test('should call onUpdate with correct params', () => {
    const beforeProps = { a: 1 }
    const afterProps = { a: 2 }
    const componentBeforUpdate = createMockComponent(beforeProps)
    const componentAfterUpdate = createMockComponent(afterProps)
    const mockOnUpdate = jest.fn()
    componentBeforUpdate.onUpdate = mockOnUpdate
    patchNode(
      renderDOM(componentAfterUpdate) as HTMLElement,
      componentBeforUpdate,
      componentAfterUpdate
    )
    expect(mockOnUpdate).toBeCalledWith(
      componentAfterUpdate,
      beforeProps,
      afterProps
    )
  })
})
