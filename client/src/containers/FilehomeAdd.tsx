import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { PageButton } from '../components/PageButton';

export const FilehomeAdd = observer((props : { className?: string }) => {
  const [open, setOpen] = useState(false);
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
  }


  return (
    <>
      <PageButton onClick={toggle} iconName="add" />

      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Create new file
        </ModalHeader>
        <ModalBody>
          {!appStore.userID && <div>Log in to create new files</div>}
          {appStore.userID && <div>* In development</div>}          

        </ModalBody>
      </Modal>
    </>
  );
});
