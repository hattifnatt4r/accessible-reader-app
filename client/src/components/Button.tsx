import classNames from 'classnames';
import './Button.css';

export function Button(props : { className?: string, children: React.ReactNode, onClick?: () => void, selected?: boolean }) {
  const { children, className, onClick, selected, ...rest } = props;
  const cl = {
    'button': 1,
    'button_selected': selected,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};