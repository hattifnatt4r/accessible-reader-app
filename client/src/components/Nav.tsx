import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from './Modal';
import { AppLink } from './AppLink';
import { Icon } from './Icon';
import { PageButton } from './PageButton';
import './Nav.css';


export const NavModal = observer((props : { className?: string }) => {
  const { className = '' } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    console.log('open:', open);
    setOpen(!open);
  }

  const cl = {
    'page-button': 1,
    [className]: className,
  };
  
  return (
    <>
      <PageButton onClick={toggle} className={classNames(cl)}>
        <Icon name="menu" className="page-button__icon" />
      </PageButton>
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

export function NavBackButton() {
  function back() {
    window.history.back();
  }
  return (
    <PageButton onClick={back}>
      <Icon name="arrow_back" className="page-button__icon" />
    </PageButton>
  );
}
