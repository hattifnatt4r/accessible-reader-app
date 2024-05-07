import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { AppLink } from '../components/AppLink';
import { Icon } from '../components/Icon';


export const ModalNav = observer((props : { children: any }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    console.log('open:', open);
    setOpen(!open);
  }
  
  return (
    <>
      <div onClick={toggle} className='modal-toggle'>
        {children}
      </div>
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>
          <AppLink to="/reader" className="home-links__link"><Icon name="book" /> Files</AppLink>
          <AppLink to="/home" className="home-links__link"><Icon name="home" /> Home</AppLink>
          <AppLink to="/chat" className="home-links__link"><Icon name="chat" /> Messages</AppLink>
          <AppLink to="/settings" className="home-links__link"><Icon name="settings" /> User Settings</AppLink>
        </ModalBody>
      </Modal>
    </>
  );
});
