import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';


export const ModalSettings = observer((props : { children: any }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    console.log('open:', open);
    setOpen(!open);
  }

  function setFontSize(fontSize: number) {
    localStorage.setItem('readerFontSize', fontSize.toString());
    console.log('f:', fontSize);
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
            <Button onClick={() => setFontSize(1)}>100%</Button>
            <Button onClick={() => setFontSize(1.25)}>125%</Button>
            <Button onClick={() => setFontSize(1.5)}>150%</Button>
            <Button onClick={() => setFontSize(2)}>200%</Button>
          </div>

          <div>
            Sound Volume
          </div>

        </ModalBody>
      </Modal>
    </>
  );
});
