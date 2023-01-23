import { IComponentVNode } from './components'
import { renderDOM } from './vdom'

describe('Virtual DOM', () => {
  test('should return div element', () => {
    const divNode = renderDOM(<div></div>)
    expect(divNode.nodeName).toBe('DIV')
  })

  test('should return div element with text (string passed)', () => {
    const text = '123'
    const divNode = renderDOM(<div>{text}</div>) as HTMLElement
    expect(divNode.innerHTML).toBe(text)
  })

  test('should return div element with text (number passed)', () => {
    const text = 123
    const divNode = renderDOM(<div>{text}</div>) as HTMLElement
    expect(divNode.innerHTML).toBe(text.toString())
  })

  test('should return div with empty text (null passed)', () => {
    const text = null
    const divNode = renderDOM(<div>{text}</div>) as HTMLElement
    expect(divNode.innerHTML).toBe('')
  })

  test('should return comment node', () => {
    const innerValue = false
    const divNode = renderDOM(<div>{innerValue}</div>) as HTMLElement
    expect(divNode.childNodes[0].nodeType === document.COMMENT_NODE).toBe(true)
  })

  test('should return div which containts class', () => {
    const className = 'test_class'
    const divNode = renderDOM(<div className={className}></div>) as HTMLElement
    expect(divNode.classList.contains(className)).toBe(true)
  })

  test('should return nested array element', () => {
    const arrayLenght = 10
    const conditinalBlockIds = Array.from({ length: arrayLenght }).map(
      (_, index) => index - 1 + '_id'
    )
    const root = renderDOM(
      <div>
        {conditinalBlockIds.map((id) => (
          <div id={id}>{id}</div>
        ))}
      </div>
    ) as HTMLElement
    expect(root.childNodes.length).toEqual(arrayLenght)
  })

  test("should return nested conditinal element's", () => {
    const arrayLenght = 10
    const hideArrayElementIndex = 6
    const conditinalBlockIds = Array.from({ length: arrayLenght }).map(
      (_, index) => index - 1
    )
    const root = renderDOM(
      <div>
        {conditinalBlockIds.map(
          (id) =>
            hideArrayElementIndex === id && <div id={id.toString()}>{id}</div>
        )}
      </div>
    ) as HTMLElement

    const children = Array.from(root.childNodes)

    expect(children[hideArrayElementIndex].nodeType).toEqual(
      document.COMMENT_NODE
    )
  })
})
