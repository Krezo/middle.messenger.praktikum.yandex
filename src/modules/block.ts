import { EventBus } from './eventBus'
import { h, renderDOM } from './vdom'

type BlockEvents<Props = any> = {
  init: []
  'flow:component-did-mount': [Partial<Props>]
  'flow:component-did-update': [Props, Props]
  'flow:render': []
}

abstract class Block<Props extends { [key: string]: unknown } = any> {
  static EVENTS: Record<string, keyof BlockEvents> = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const

  eventBus: () => EventBus<BlockEvents<Props>>

  props: Props

  _element:
    | HTMLElement
    | Text
    | SVGSVGElement
    | SVGLineElement
    | SVGPolygonElement

  _meta: {
    tagName: keyof HTMLElementTagNameMap
    props: { [K in keyof Props]?: Props[K] }
  }

  constructor(
    tagName: keyof HTMLElementTagNameMap = 'div',
    props = {} as Props,
  ) {
    const eventBus = new EventBus()
    this._meta = {
      tagName,
      props,
    }

    this.props = this._makePropsProxy(props)

    this.eventBus = () => eventBus

    this._registerEvents(eventBus)
    eventBus.emit(Block.EVENTS.INIT)
  }

  _registerEvents(eventBus: EventBus<BlockEvents>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  _createResources() {
    const { tagName } = this._meta
    this._element = this._createDocumentElement(tagName)
  }

  init() {
    this._createResources()
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  _componentDidMount() {
    this.componentDidMount(this.props)
  }

  componentDidMount(oldProps: Partial<Props> = {}) {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  _componentDidUpdate(oldProps: Partial<Props>, newProps: Partial<Props>) {
    if (this.componentDidUpdate(oldProps, newProps)) {
      console.log('_componentDidUpdate', oldProps, newProps)
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
    }
  }

  componentDidUpdate(oldProps: Partial<Props>, newProps: Partial<Props>) {
    return true
  }

  setProps = (nextProps: Partial<Props>) => {
    if (!nextProps) {
      return
    }

    Object.assign(this.props, nextProps)
  }

  get element() {
    return this._element
  }

  _render() {
    const block = this.render()
    if (typeof block === 'string') {
      if (this._element instanceof HTMLElement) {
        this._element.innerHTML = block
      } else throw Error('Element has wrong type')
    } else {
      this._element.replaceWith(block)
      this._element = block
    }
  }

  abstract render():
    | string
    | HTMLElement
    | Text
    | SVGSVGElement
    | SVGLineElement
    | SVGPolygonElement

  getContent() {
    return this.element
  }

  _makePropsProxy(props: Props) {
    const self = this
    const _props = new Proxy(props, {
      get(target, prop) {
        return Reflect.get(target, prop)
      },
      set(target, prop, newValue) {
        const oldPropValue = target[prop.toString()]
        if (oldPropValue !== 'newValue') {
          Reflect.set(target, prop, newValue)
          self
            .eventBus()
            .emit(
              'flow:component-did-update',
              { ...self.props, [prop]: oldPropValue },
              { ...self.props, [prop]: newValue },
            )
        }
        return true
      },
    })
    return _props
  }

  _createDocumentElement(tagName: keyof HTMLElementTagNameMap) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName)
  }

  show() {
    const el = this.getContent()
    if (el instanceof Text) {
      throw Error("Can't hide Text node element")
    } else el.style.display = 'block'
  }

  hide() {
    const el = this.getContent()
    if (el instanceof Text) {
      throw Error("Can't hide Text node element")
    } else el.style.display = 'none'
  }
}

export default Block
