import { Logo } from '../../components/logoComponent';
import { DefaultLayout } from '../../layout/defaultLayout/defaultLayout';
import { createApp, h } from '../../modules/vdom';
import { Input } from '../../components/input/input.component';
import { computed, ref, watch, watchEffect } from '../../modules/reactivity';
import { Button } from '../../components/button/buttonComponent';

import LeftArrow from '../../images/left_arrow.svg';
import AvatarPlaceholder from '../../images/avatar_placeholder.jpeg';

import style from './settings.page.module.css';
import styles from '../../css/app.module.css';
import { useForm } from '../../composibles/useForm';
import { name } from '../../modules/validatorRules';

type EditMode = 'none' | 'edit' | 'editPassword'


document.addEventListener('DOMContentLoaded', () => {

  const mode = ref<EditMode>('edit');

  const { formData, values, isValid } = useForm({
    firstname: {
      value: '',
      validators: {
        ...name('именем')
      },
      blur,
      toched: false,
      valid: false,
      errorMessage: ''
    },
    secondname: {
      value: '',
      validators: {
        ...name('фамилией')
      },
      blur,
      toched: false,
      valid: false,
      errorMessage: ''
    },
  })

  createApp(document.getElementById('app'), () =>
    <DefaultLayout>
      <div className={style.settingsPage}>
        <a href='/' className={style.backToChat}>
          <div className={style.backToChatArrow}>
            <img src={LeftArrow} alt="left" />
          </div>
          <div className={[styles.h2, style.backToChatText].join(' ')}>Вернуться в чат</div>
        </a>
        <form action="" className={style.settingsForm} >
          <h2 className={styles.h2}>Настройки профиля</h2>
          <div className={style.avatar}>
            <img src={AvatarPlaceholder} alt="" />
            <div style={mode.value === 'edit' ? '' : 'display: none'}>
              <Button primary outline small className={style.avatarChangeBtn} >Сменить</Button>
            </div>
          </div>
          <div style={mode.value === 'none' ? '' : 'display: none'}>
            <div className={style.inputs}>
              <div>
                <div>Имя в чате</div>
                <div>Антон Безушко</div>
              </div>
              <div>
                <div>Имя</div>
                <div>Антон </div>
              </div>
              <div>
                <div>Фамилия</div>
                <div>Безушко</div>
              </div>
              <div>
                <div>Имя в чате</div>
                <div>Антон Безушко</div>
              </div>
              <div>
                <div>Логин</div>
                <div>abez</div>
              </div>
              <div>
                <div>Email</div>
                <div>bezushko.aiu@gmail.com</div>
              </div>
              <div>
                <div>Телефон</div>
                <div>8-123-123-12-12</div>
              </div>
            </div>
            <Button primary className={style.editBtn} onClick={() => mode.value = 'edit'}>Редактировать</Button>
            <div onClick={() => mode.value = 'editPassword'} className={[styles.link, style.editPswLink].join(' ')}>Изменить пароль</div>
          </div>
          <div style={mode.value === 'edit' ? '' : 'display: none'} className={style.inputsEdit}>
            <Input
              placeholder='Имя'
              onBlur={() => formData.firstname.blur()}
              toched={formData.firstname.toched}
              errorMessage={formData.firstname.errorMessage}
              setValue={(value: string) => formData.firstname.value = value}
            />
            <Input
              placeholder='Фамилия'
              onBlur={() => formData.secondname.blur()}
              toched={formData.secondname.toched}
              errorMessage={formData.secondname.errorMessage}
              setValue={(value: string) => formData.secondname.value = value}
            />
            <Input placeholder='Имя в чате  ' />
            <Input placeholder='Логин' />
            <Input placeholder='Email' />
            <Input placeholder='Телефон' />
            <Button primary>Сохранить</Button>
            <Button primary outline>Отмена</Button>
          </div>
          <div style={mode.value === 'editPassword' ? '' : 'display: none'} className={style.inputsEdit}>
            <div className={style.changePasswordTooltip}>Введите старый и затем новый пароль</div>
            <Input placeholder='Старый пароль' />
            <Input placeholder='Пароль' />
            <Button primary>Сохранить</Button>
            <Button primary outline>Отмена</Button>
          </div>
        </form>
      </div>

    </DefaultLayout>
  ).mount();
})