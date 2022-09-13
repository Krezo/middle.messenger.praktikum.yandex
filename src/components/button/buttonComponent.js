import Component from '../../modules/component';
import classes from './button.module.css';

export const props = {
  class: ''
}

export const state = { a: 1 }

export default new Component((props) => {
  const btnSize = props.size ? classes[props.size] : '';
  const btnType = props.type ? classes[props.type] : '';
  const btnRounded = ('rounded' in props) ? classes.rounded : '';
  return `
  <button class="${classes.btn} ${btnSize} ${btnType} ${btnRounded} ${props.class}">
  <slot></slot>
  </button>`
}, state, props)



