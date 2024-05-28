import classNames from 'classnames';
import { SvgIcon } from './Icon';
import './PageControls.css';


export function PageControls(props: { className?: string, children?: React.ReactNode | null }) {
  const {
    children,
    className = '',
  } = props;

  const cl = {
    'page-controls': 1,
    [className]: className,
  };

  return (
    <div className={classNames(cl)}>
      <div className="page-controls__flex">
        {children}
      </div>
    </div>
  );
}


export function PageButton(props: { iconSvgname?: string, onClick?: () => void, children?: React.ReactNode | null, className?: string, empty?: boolean, disabled?: boolean }) {
  const {
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
    <div className="page-button-wrap">
      <div className={classNames(cl)} onClick={!disabled ? onClick : () => {}}>      
        {iconSvgname && <SvgIcon iconName={iconSvgname} className="page-button__svg"/>}
        {children}
      </div>
    </div>
  );
}