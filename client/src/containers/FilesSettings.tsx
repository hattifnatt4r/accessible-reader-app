import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { PageButton } from '../components/PageControls';
import { FormFieldOptions } from '../components/FormButton';
import { getNarrateSupported } from '../utils/misc';


export const FilesSettings = observer((props : { className?: string }) => {
  const [open, setOpen] = useState(false);
  const appStore = window.app;
  const form = appStore.userSettings;

  function toggle() {
    setOpen(!open);
  }

  function setValue(name: string, value: string) {
    appStore.updateSettings({ [name]: value });
  }


  return (
    <>
      <PageButton onClick={toggle} iconSvgname="settings" />

      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Files settings
        </ModalHeader>
        <ModalBody>

          <FormFieldOptions
            form={form}
            name="filesNarrateSelection"
            title="Narrate when selecting file"
            onChange={setValue}
            options={[
              { v: '0', l: 'Off' },
              { v: '1', l: 'On' },
            ]}
          />
          <FormFieldOptions
            form={form}
            name="globalVolume"
            title="Sound Volume (global)"
            onChange={setValue}
            options={[
              { v: '25', l: '25%' },
              { v: '50', l: '50%' },
              { v: '75', l: '75%' },
              { v: '100', l: '100%' },
            ]}
          />
          <div style={{ marginTop: '2rem' }}>
            {!getNarrateSupported() && <div className="note_error">Narrate feature is not supported in your browser.</div>} 
          </div>
        </ModalBody>
      </Modal>
    </>
  );
});
