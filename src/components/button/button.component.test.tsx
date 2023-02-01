import { renderDOM } from '../../modules/vdom'
import { Button } from './buttonComponent'
import spinnerStyles from '../spinner/spinner.component.module.css'

describe('Button component', () => {
  test('should call onClick handler', () => {
    const mockOnClick = jest.fn()
    const root = renderDOM(<Button onClick={mockOnClick} />)
    root.dispatchEvent(new Event('click'))
    expect(mockOnClick).toBeCalledTimes(1)
  })

  test('should return button with link tag', () => {
    const root = renderDOM(<Button link />)
    expect(root.nodeName).toBe('A')
  })

  test('should show spinner when prop loading is true', () => {
    const root = renderDOM(<Button loading />) as HTMLElement
    expect(
      root.lastElementChild?.classList.contains(spinnerStyles.spinner)
    ).toBe(true)
  })
})
