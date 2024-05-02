import classNames from 'classnames';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AppLink(props : { to: string, className?: string, children: ReactNode }) {
  const { to, className, children, ...rest } = props;
  const cl = {
    'app-link': 1,
    [className || '']: !!className,
  };
  return (
    <Link to={to} className={classNames(cl)}>{children}</Link>
  );
};