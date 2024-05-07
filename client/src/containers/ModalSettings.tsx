import React, { useEffect, useState } from 'react';
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
  
  return (
    <>
      <div onClick={toggle} className='modal-toggle'>
        {children}
      </div>
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>
          Font Size <br/>
          Sound Volume <br/>

        </ModalBody>
      </Modal>
    </>
  );
});
