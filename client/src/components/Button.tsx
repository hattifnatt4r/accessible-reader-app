import classNames from 'classnames';
import './Button.css';

export function Button(props : { className?: string, children: any, onClick?: any }) {
  const { children, className, onClick, ...rest } = props;
  const cl = {
    'button': 1,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};