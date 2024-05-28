import classNames from 'classnames';
import { Icon } from './Icon';
import './Modal.css';


export function Modal(props : { isOpen?: boolean, className?: string, children: React.ReactNode, toggle: () => void }) {
  const { className, children, isOpen, toggle } = props;

  const cl = {
    'modal': 1,
    [className || '']: !!className,
  };
  if (!isOpen) return null;
  return (
    <div className='modal-bkg' onClick={toggle}>
      <div className={classNames(cl)} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export function ModalBody(props : { className?: string, children: React.ReactNode }) {
  const { className, children } = props;
  const cl = {
    'modal-body': 1,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)}>
      {children}
    </div>
  );
}

export function ModalHeader(props : { className?: string, children: React.ReactNode, toggle: () => void }) {
  const { className, children, toggle } = props;
  const cl = {
    'modal-header': 1,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)}>
      {children}
      <div className="modal-header__close" onClick={toggle}><Icon name="close"/></div>
    </div>
  );
}