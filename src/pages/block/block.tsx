import Block from '../../modules/block'
import { h, renderDOM } from '../../modules/vdom'

type IButtonProps = {
  type: string
  onClick: () => void
}

class Button extends Block<IButtonProps> {
  constructor(props: IButtonProps) {
    super('button', props)
  }
  render() {
    const { type, onClick } = this.props
    return renderDOM(
      <button className={`btn-${type}`} onClick={onClick}>
        Button
      </button>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttonEl = document.getElementById('button')
  const button = new Button({
    type: 'primary',
    onClick: () => alert('onClick'),
  })
  buttonEl?.replaceWith(button.render())
  setTimeout(() => button.setProps({ type: 'secondary' }), 1000)
})
