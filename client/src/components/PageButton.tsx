import classNames from 'classnames';
import { Icon } from './Icon';
import './PageButton.css';


export function PageButton(props: { iconName?: string | null, onClick?: () => void, children?: React.ReactNode | null, className?: string, empty?: boolean, disabled?: boolean }) {
  const { iconName = '', onClick, children, className = '', empty, disabled } = props;

  const cl = {
    'page-button': 1,
    'page-button_empty': empty,
    'page-button_disabled': disabled,
    [className]: className,
  };

  return (
    <div className={classNames(cl)} onClick={!disabled ? onClick : () => {}}>
      {iconName && <Icon name={iconName} className="page-button__icon" />}
      {children}
    </div>
  );
}