// import Component from '../../modules/component';
// import buttonComponent from '../button/buttonComponent';
// import logoComponent from '../logoComponent';
import style from './header.module.css';
import styles from '../../css/app.module.css';

import { h, IVNode } from '../../modules/vdom'
import { Button } from '../button/buttonComponent';
import { IComponentProps } from '../../modules/components'
import { Logo } from '../logoComponent';


// const component = new Component(
//   (props) => `
// <nav class="${classes.headerWrapper}">
//   <div class="${appStyles.container} ${classes.header}">
//     <a href="/"><Logo /></a>
//     <div class="${classes.logRegButtons}">
//     <div><Button size="small" type="primary" rounded>Войти</Button></div>
//     <div><Button size="small" type="secondary" rounded>Регистрация</Button></div>
//     </div>
//   </div>
// </nav>
// `
// );

// component.register('Logo', logoComponent);
// component.register('Button', buttonComponent);

// export default component;

interface IProps extends IComponentProps {
  slot?: IVNode,
}

const Header = (props: IProps) => {
  return (
    <div>
      <nav className={`${style.headerWrapper}`} >
        <div className={`${styles.container} ${style.header}`}>
          <a href="/"><Logo /></a>
          <div className={style.logRegButtons}>
            <div><Button primary rounded >Войти</Button></div>
            <div><Button primary rounded outline >Регистрация</Button></div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export {
  Header
}
