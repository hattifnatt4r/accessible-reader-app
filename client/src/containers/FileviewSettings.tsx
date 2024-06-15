import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { PageButton } from '../components/PageControls';
import { FormFieldOptions } from '../components/FormButton';
import { getNarrateSupported } from '../utils/misc';


export const FileviewSettings = observer((props: { viewerMode: string, onModeChange: (val: string) => void, canEdit: boolean }) => {
  const { onModeChange, viewerMode, canEdit } = props;
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
          Viewer settings
        </ModalHeader>
        <ModalBody>
          <FormFieldOptions
            form={form}
            name="readerFontSize"
            title="Viewer Font Size"
            onChange={setValue}
            options={[
              { v: '100', l: '100%' },
              { v: '125', l: '125%' },
              { v: '150', l: '150%' },
              { v: '200', l: '200%' },
            ]}
          />
          <FormFieldOptions
            form={form}
            name="readerNarrateSelection"
            title="Narrate when selecting text"
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
          <FormFieldOptions
            form={form}
            name="globalNarrateRate"
            title="Narrate Speed (global)"
            onChange={setValue}
            options={[
              { v: '50', l: '50%' },
              { v: '75', l: '75%' },
              { v: '100', l: '100%' },
            ]}
          />
          <div style={{ marginTop: '-1.5rem', marginBottom: '3rem' }}>
            {!getNarrateSupported() && <div className="note_error">Narrate feature is not supported in your browser.</div>} 
          </div>

          {canEdit && (
            <FormFieldOptions
              form={{ mode: viewerMode }}
              name="mode"
              title="View mode"
              onChange={(name, val) => onModeChange(val)}
              options={[
                { v: 'view', l: 'View' },
                { v: 'edit', l: 'Edit' },
              ]}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
});
