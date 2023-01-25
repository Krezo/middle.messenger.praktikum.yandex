import '../../css/app.css'
import style from './defaultLayout.module.css'
import styles from '../../css/app.module.css'
import { IComponentProps } from '../../modules/components'

import { Header } from '../../components/header/header.component'

function DefaultLayout(props: IComponentProps) {
  return (
    <div>
      {/* <Header /> */}
      <main>{props.children}</main>
    </div>
  )
}

export { DefaultLayout }
