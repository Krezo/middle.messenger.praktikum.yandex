import '../../css/app.css'
import { IComponentProps } from '../../modules/components'

function DefaultLayout(props: IComponentProps) {
  return (
    <div>
      {/* <Header /> */}
      <main>{props.children}</main>
    </div>
  )
}

export { DefaultLayout }
