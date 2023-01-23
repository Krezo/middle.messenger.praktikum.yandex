import { renderDOM } from '../../modules/vdom'
import { Modal } from './modal.component'

describe('Modal component', () => {
  test('should show when prop open true', () => {
    const root = renderDOM(<Modal open={true} />)
    expect(root.firstChild?.nodeType).toBe(document.ELEMENT_NODE)
  })

  test('should hide when prop open false', () => {
    const root = renderDOM(<Modal open={false} />)
    expect(root.firstChild?.nodeType).toBe(document.COMMENT_NODE)
  })

  test('should call close handler when click on close button', () => {
    const mockClose = jest.fn()
    const root = renderDOM(
      <Modal open={true} close={mockClose} />
    ) as HTMLElement
    root.querySelector('svg')?.dispatchEvent(new Event('click'))
    expect(mockClose).toBeCalledTimes(1)
  })
})
