import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';
import { PageButton } from '../components/PageButton';
import './FileviewSettings.css';

export const FilehomeSettings = observer((props : { className?: string }) => {
  const [open, setOpen] = useState(false);
  const appStore = window.app;
  // const currentFontSize = appStore.userSettings.readerFontSize;
  const currentVolume = appStore.userSettings.globalVolume;
  const currentNarrate = appStore.userSettings.filesNarrateSelection;

  function toggle() {
    setOpen(!open);
  }

  function setVolume(value: number) {
    appStore.updateSettings({ globalVolume: value });
  }
  function setNarrateSelection(value: number) {
    appStore.updateSettings({ filesNarrateSelection: value });
  }


  return (
    <>
      <PageButton onClick={toggle} iconName="settings" />

      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Files settings
        </ModalHeader>
        <ModalBody>

          <div className="modal-settings__group">
            Narrate when selecting file <br/>
            <Button onClick={() => setNarrateSelection(0)} selected={currentNarrate == 0}>Off </Button>
            <Button onClick={() => setNarrateSelection(1)} selected={currentNarrate == 1}>On </Button>
          </div>

          <div className="modal-settings__group">
            Sound Volume (global)<br/>
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
