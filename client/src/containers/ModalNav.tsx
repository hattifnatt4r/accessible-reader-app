import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { AppLink } from '../components/AppLink';
import { Icon } from '../components/Icon';
import './ModalNav.css';


export const ModalNav = observer((props : { children: React.ReactNode, className?: string }) => {
  const { children, className = '' } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    console.log('open:', open);
    setOpen(!open);
  }

  const cl = {
    'modal-toggle': 1,
    [className]: className,
  };
  
  return (
    <>
      <div onClick={toggle} className={classNames(cl)}>
        {children}
      </div>
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>
          <AppLink to="/reader" className="modal-nav__link"><Icon name="book" /> Files</AppLink>
          <AppLink to="/home" className="modal-nav__link"><Icon name="home" /> Home</AppLink>
          <AppLink to="/chat" className="modal-nav__link"><Icon name="chat" /> Messages</AppLink>
          <AppLink to="/settings" className="modal-nav__link"><Icon name="settings" /> User Settings</AppLink>
        </ModalBody>
      </Modal>
    </>
  );
});
