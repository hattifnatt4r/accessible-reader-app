import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '../components/Button';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';
import './FileviewSettings.css';
import { PageButton } from '../components/PageButton';

export const FileviewSettings = observer((props : { className?: string }) => {
  const { className = '' } = props;
  const [open, setOpen] = useState(false);
  const appStore = window.app;
  const currentFontSize = appStore.userSettings.readerFontSize;
  const currentVolume = appStore.userSettings.readerVolume;
  const currentNarrate = appStore.userSettings.readerNarrateSelection;

  function toggle() {
    setOpen(!open);
  }

  function setFontSize(value: number) {
    appStore.updateSettings({ readerFontSize: value });
  }
  function setVolume(value: number) {
    appStore.updateSettings({ readerVolume: value });
  }
  function setNarrateSelection(value: number) {
    appStore.updateSettings({ readerNarrateSelection: value });
  }
  
  const cl = {
    'modal-toggle': 1,
    [className]: className,
  };

  return (
    <>
      <PageButton onClick={toggle} iconName="settings" />

      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>
          <div className="modal-settings__group">
            Viewer Font Size <br/>
            <Button onClick={() => setFontSize(1)} selected={currentFontSize == 1}>100% </Button>
            <Button onClick={() => setFontSize(1.25)} selected={currentFontSize == 1.25}>125% </Button>
            <Button onClick={() => setFontSize(1.5)} selected={currentFontSize == 1.5}>150% </Button>
            <Button onClick={() => setFontSize(2)} selected={currentFontSize == 2}>200%</Button>
          </div>

          <div className="modal-settings__group">
            Narrate when selecting text <br/>
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
