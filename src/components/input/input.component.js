import Component from '../../modules/component';
import styles from "./input.component.module.css";

const state = {}
const defaultProps = {
  type: 'text',
  class: '',
  value: '',
  placeholder: ''
}

export default new Component((props) => `
  <input type="${props.type}" class="${styles.input} ${props.class}" placeholder="${props.placeholder}" value="${props.value}" id="${props.id}" style="${props.style}" />
`, state, defaultProps)