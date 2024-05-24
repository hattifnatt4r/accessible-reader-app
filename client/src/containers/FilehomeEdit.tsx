import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { PageButton } from '../components/PageButton';
import { ReaderFileType } from '../consts/dataTypes';

export const FilehomeEdit = observer((props : { file: ReaderFileType | null }) => {
  const { file } = props;
  const [open, setOpen] = useState(false);
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
  }


  return (
    <>
      <PageButton onClick={toggle} iconName="more_horiz" />

      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Delete / copy file
        </ModalHeader>
        <ModalBody>
          {!appStore.userID && <div>Log in to delete/copy files</div>}
          {file && appStore.userID && <div>* In development</div>}          
          {!file && appStore.userID && <div>File not selected</div>}          

        </ModalBody>
      </Modal>
    </>
  );
});
