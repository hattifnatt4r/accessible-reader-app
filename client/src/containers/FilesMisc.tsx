import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { FileIDType, ReaderFileType } from '../consts/dataTypes';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { PageButton } from '../components/PageControls';
import { Icon } from '../components/Icon';
import './FilesMisc.css';

export function FilesFile(props : { file: ReaderFileType, className?: string, selected: boolean, setFileID: (id: FileIDType) => void }) {
  const { file, className, setFileID, selected, ...rest } = props;
  const cl = {
    'fhome-file': 1,
    'fhome-file_selected': selected,
    [className || '']: !!className,
  };

  function selectFile() {
    setFileID(file?.id || null);
  }
  
  return (
    <div className={classNames(cl)} onClick={selectFile}>
      <div className="fhome-file__flex">
        <Icon name="draft" filled className="fhome-file__icon" />
        
        <div className="fhome-file__name">
          {file?.name} - {file?.title}
        </div>
      </div>
      {/* <AppLink to={`/files/${file?.id}`}> Open </AppLink> */}
    </div>
  );
};



export const FilesEdit = observer((props : { file: ReaderFileType | null }) => {
  const { file } = props;
  const [open, setOpen] = useState(false);
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
  }

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="menu-dots" />

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


export const FilesAdd = observer((props : { className?: string }) => {
  const [open, setOpen] = useState(false);
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
  }

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="plus" />

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
