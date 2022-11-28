import '../../css/app.css'
import style from "./defaultLayout.module.css";
import styles from "../../css/app.module.css";
import { IComponentProps } from '../../modules/components';
import { h } from '../../modules/vdom';
import { Header } from '../../components/header/header.component';

const DefaultLayout = (props: IComponentProps) => {
  return <main>
    <Header />
    <div className={styles.container}>
      {props.children}
    </div>
  </main>
}

export {
  DefaultLayout
}

