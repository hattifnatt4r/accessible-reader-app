import classNames from 'classnames';

export function Icon(props : { name: string | null, className?: string }) {
  const { name, className, ...rest } = props;
  const cl = {
    'material-symbols-outlined': 0,
    'material-symbols-rounded': 1,
    [className || '']: !!className,
  };
  return (
    <span className={classNames(cl)} {...rest}>{name}</span>
  );
};