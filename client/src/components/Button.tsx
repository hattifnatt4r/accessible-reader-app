import classNames from 'classnames';
import './Button.css';

export function Button(props : { type?: string, className?: string, disabled?: boolean, children: React.ReactNode, onClick?: () => void, linkButton?: boolean, linkButton2?: boolean, style?: {[key:string] : string} }) {
  const { children, className, onClick, linkButton, linkButton2, disabled, style = {} } = props;
  const cl = {
    'button': !linkButton && !linkButton2,
    'button_link': linkButton,
    'button_link2': linkButton2,
    'button_disabled': disabled,
    [className || '']: !!className,
  };

  function handleClick(event: any) {
    event.preventDefault();
    if (onClick) onClick();
  }
  return (
    <button className={classNames(cl)} onClick={handleClick} style={style}>
      {children}
    </button>
  );
};