import classNames from 'classnames';
import './Modal.css';
import { useEffect, useState } from 'react';

export function Modal(props : { isOpen?: boolean, className?: string, children: any, toggle: any, toggleButton: any }) {
  const { className, children, isOpen, toggleButton, toggle, ...rest } = props;
  const [open, setOpen] = useState(false);

  /*
  useEffect(() => {
    if (!uncontrolled) {
      setOpen(isOpen || false);
    }
  }, [isOpen]);

  function modalToggle() { setOpen(!open); }
  if (!open && uncontrolled) return toggleButton;
  */

  const cl = {
    'modal': 1,
    [className || '']: !!className,
  };
  if (!isOpen) return null;
  return (
    <div className='modal-bkg' onClick={toggle}>
      <div className={classNames(cl)}>
        {children}
      </div>
    </div>
  );
};

export function ModalBody(props : { className?: string, children: any }) {
  const { className, children, ...rest } = props;
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

export function ModalHeader(props : { className?: string, children: any }) {
  const { className, children, ...rest } = props;
  const cl = {
    'modal-header': 1,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)}>
      {children}
    </div>
  );
}