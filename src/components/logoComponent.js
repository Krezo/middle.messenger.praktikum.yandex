import Component from '../modules/component';
import logo from '../images/logo.svg'

export default new Component((props) => `<img class="{{props.class}}" src="${logo}" alt="Logo"></img>`)