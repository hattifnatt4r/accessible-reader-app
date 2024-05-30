import classNames from 'classnames';
import './Button.css';

export function Button(props : { className?: string, disabled?: boolean, children: React.ReactNode, onClick?: () => void, linkButton?: boolean, linkButton2?: boolean }) {
  const { children, className, onClick, linkButton, linkButton2, disabled } = props;
  const cl = {
    'button': !linkButton && !linkButton2,
    'button_link': linkButton,
    'button_link2': linkButton2,
    'button_disabled': disabled,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)} onClick={onClick}>
      {children}
    </div>
  );
};