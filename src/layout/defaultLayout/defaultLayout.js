import Component from '../../modules/component';
import '../../css/app.css'
import headerComponent from '../../components/header/header.component';
import footerComponent from '../../components/footer/footer.component';
import styles from "./defaultLayout.module.css";

const defaultLayoutComponent = new Component(() => `
<div class="${styles.page}">
  <Header>header</Header>
  <div class="${styles.page_inner}">
  <slot></slot>
  </div>
  <Footer>footer</Footer>
</div>
`);

defaultLayoutComponent.register('Header', headerComponent)
defaultLayoutComponent.register('Footer', footerComponent)

export default {
  name: 'defaultLayout',
  component: defaultLayoutComponent
}