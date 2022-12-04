import { IComponentProps } from '../../modules/components';

import style from './button.module.css';

import { h } from '../../modules/vdom';
interface IProps extends IComponentProps {
  primary?: boolean
  outline?: boolean
  type?: 'button' | 'submit' | 'reset'
  link?: boolean
  rounded?: boolean
  small?: boolean
  empty?: boolean
  text?: string
  href?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
}

function Button(props: IProps = {}) {
  const {
    primary, small, type, disabled, outline, rounded, className, onClick, href,
  } = props;

  const btnClasses = [
    style.btn,
    primary ? style.primary : '',
    outline ? style.outline : '',
    small ? style.small : '',
    rounded ? style.rounded : '',
    ...(className ?? '').split(' '),
  ];

  const ButtonTag = props.link ? 'a' : 'button';

  return (
    <ButtonTag
      type={type ?? 'button'}
      href={href}
      disabled={disabled}
      className={btnClasses.join(' ')}
      onClick={props.onClick}>
      {props.children}
    </ButtonTag>
  );
}

export {
  Button,
};
