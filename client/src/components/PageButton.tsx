import classNames from 'classnames';
import { Icon, SvgIcon } from './Icon';
import './PageButton.css';


export function PageButton(props: { iconName?: string | null, iconSvgname?: string, onClick?: () => void, children?: React.ReactNode | null, className?: string, empty?: boolean, disabled?: boolean }) {
  const {
    iconName = '',
    iconSvgname = '',
    onClick, children,
    className = '',
    empty,
    disabled,
  } = props;

  const cl = {
    'page-button': 1,
    'page-button_empty': empty,
    'page-button_disabled': disabled,
    'hover-move': 1,
    [className]: className,
  };

  return (
    <div className={classNames(cl)} onClick={!disabled ? onClick : () => {}}>
      {iconName && <Icon name={iconName} className="page-button__icon" />}
      {iconSvgname && <SvgIcon iconName={iconSvgname} className="page-button__svg"/>}
      {children}
    </div>
  );
}