import classNames from 'classnames';
import './Icon.css';

export function Icon(props : { name: string | null, className?: string, filled?: boolean }) {
  const { name, className, filled, ...rest } = props;
  const cl = {
    'material-symbols-rounded': 1,
    'icon_filled': filled,
    [className || '']: !!className,
  };
  return (
    <span className={classNames(cl)} {...rest}>{name}</span>
  );
};

export function SvgIcon(props: { iconName?: string | null, className?: string }) {
  const { iconName = '', className = '' } = props;

  const cl = {
    'icon-mask': 1,
    [className]: className,
  };

  if (!iconName) return null;

  return <div className={classNames(cl)}><div style={{ maskImage: `url('/icons_svg/${iconName}.svg')` }} className="icon-mask__svg"/></div>;
}