import '/src/css/app.css'
import styles from "./errorLayout.module.css";
import footerComponent from '../../components/footer/footer.component';
import headerComponent from '../../components/header/header.component';
import buttonComponent from '../../components/button/buttonComponent';
import Component from '../../modules/component';

const defaultProps = {
  statusCode: 'ERRROR',
  text: 'УПС, НЕОПОЗНАННАЯ ОШИБКА',
  textDiscription: '',
}

const errorLayoutComponent = new Component((props) => `
<div class="${styles.error_page}">
  <Header>header</Header>
  <div class="${styles.error_page_inner}">
  <div class="${styles.statusCode}">${props.statusCode}</div>
  <div class="${styles.error_text}">${props.text}</div>
  <p class="${styles.error_text_discription}">${props.textDiscription}</p>
  <a href="/">
  <Button class="${styles.button}" type="primary">
    НА ГЛАВНУЮ
  </Button>
  </a>
  </div>
  <Footer>footer</Footer>
</div>
`, defaultProps);

errorLayoutComponent.register('Header', headerComponent)
errorLayoutComponent.register('Button', buttonComponent)
errorLayoutComponent.register('Footer', footerComponent)

export default {
  name: 'errorLayout',
  component: errorLayoutComponent
}