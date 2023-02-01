import { renderDOM } from '../../modules/vdom'
import { Input } from './input.component'

describe.only('Input component', () => {
  test('should contain placeholder', () => {
    const placeholder = 'text_placeholder'
    const root = renderDOM(
      <Input id="test" placeholder={placeholder} />
    ) as HTMLElement
    expect(root.querySelector('input')?.placeholder).toBe(placeholder)
  })

  test('should contain label', () => {
    const label = 'text_label'
    const root = renderDOM(<Input id="test" label={label} />) as HTMLElement
    expect(root.querySelector('label')?.innerHTML).toBe(label)
  })

  test('should return label tagname when input type is file', () => {
    const root = renderDOM(<Input id="test" type="file" />) as HTMLElement
    expect(root.nodeName).toBe('LABEL')
  })

  test('should call setValue when value is changed', () => {
    const mockSetValue = jest.fn()
    const root = renderDOM(
      <Input id="test" setValue={mockSetValue} />
    ) as HTMLElement
    const input = root.querySelector('input')!
    input.value = 'new_test_value'
    input.dispatchEvent(new Event('input'))
    expect(mockSetValue).toBeCalledTimes(1)
  })
})
