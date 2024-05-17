import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import './FileviewSettings.css';

export const FileeditSettings = observer((props : { children: React.ReactNode }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const appStore = window.app;
  const currentFontSize = appStore.userSettings.editorFontSize;
  const currentVolume = appStore.userSettings.readerVolume;
  const currentNarrate = appStore.userSettings.editorNarrateSelection;

  function toggle() {
    setOpen(!open);
  }

  function setFontSize(value: number) {
    appStore.updateSettings({ editorFontSize: value });
  }
  function setVolume(value: number) {
    appStore.updateSettings({ readerVolume: value });
  }
  function setNarrateSelection(value: number) {
    appStore.updateSettings({ editorNarrateSelection: value });
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
          <div className="modal-settings__group">
            Editor Font Size <br/>
            <Button onClick={() => setFontSize(1)} selected={currentFontSize == 1}>100% </Button>
            <Button onClick={() => setFontSize(1.25)} selected={currentFontSize == 1.25}>125% </Button>
            <Button onClick={() => setFontSize(1.5)} selected={currentFontSize == 1.5}>150% </Button>
            <Button onClick={() => setFontSize(2)} selected={currentFontSize == 2}>200%</Button>
            <Button onClick={() => setFontSize(2.5)} selected={currentFontSize == 2.5}>250%</Button>
            <Button onClick={() => setFontSize(3)} selected={currentFontSize == 3}>300%</Button>
            <Button onClick={() => setFontSize(4)} selected={currentFontSize == 4}>400%</Button>
          </div>

          <div className="modal-settings__group">
            Narrate when cursor moves <br/>
            <Button onClick={() => setNarrateSelection(0)} selected={currentNarrate == 0}>Off </Button>
            <Button onClick={() => setNarrateSelection(1)} selected={currentNarrate == 1}>On </Button>
          </div>

          <div className="modal-settings__group">
            Sound Volume <br/>
            <Button onClick={() => setVolume(0.25)} selected={currentVolume == 0.25}>25% </Button>
            <Button onClick={() => setVolume(0.5)} selected={currentVolume == 0.5}>50% </Button>
            <Button onClick={() => setVolume(0.75)} selected={currentVolume == 0.75}>75% </Button>
            <Button onClick={() => setVolume(1)} selected={currentVolume == 1}>100% </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
});
