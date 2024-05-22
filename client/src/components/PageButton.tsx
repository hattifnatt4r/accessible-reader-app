import classNames from 'classnames';
import { Icon } from './Icon';
import './PageButton.css';


export function PageButton(props: { iconName?: string | null, onClick?: () => void, children?: React.ReactNode | null, className?: string }) {
  const { iconName = '', onClick, children, className = '' } = props;

  const cl = {
    'page-button': 1,
    [className]: className,
  };

  return (
    <div className={classNames(cl)} onClick={onClick}>
      <Icon name={iconName} className="page-button__icon" />
      {children}
    </div>
  );
}