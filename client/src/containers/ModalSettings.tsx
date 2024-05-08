import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';


export const ModalSettings = observer((props : { children: React.ReactNode }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const appStore = window.app;
  const currentFontSize = appStore.userSettings.readerFontSize;

  function toggle() {
    console.log('open:', open, appStore.userSettings);
    setOpen(!open);
  }

  function setFontSize(fontSize: number) {
    appStore.updateSettings({ readerFontSize: fontSize });
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
          <div>
            Font Size <br/>
            <Button onClick={() => setFontSize(1)} selected={currentFontSize == 1}>100% </Button>
            <Button onClick={() => setFontSize(1.25)} selected={currentFontSize == 1.25}>125% </Button>
            <Button onClick={() => setFontSize(1.5)} selected={currentFontSize == 1.5}>150% </Button>
            <Button onClick={() => setFontSize(2)} selected={currentFontSize == 2}>200%</Button>
          </div>

          <div>
            Sound Volume
          </div>

        </ModalBody>
      </Modal>
    </>
  );
});
