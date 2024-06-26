import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { FormFieldOptions } from '../components/FormButton';
import './EditorSettings.css';

export const EditorSettings = observer((props : { children: React.ReactNode, className: string }) => {
  const { children, className } = props;
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
      <div onClick={toggle} className={className}>
        {children}
      </div>
      <Modal isOpen={open} toggle={toggle} className="fileedit-modal">
        <ModalHeader toggle={toggle}>
          Editor settings
        </ModalHeader>
        <ModalBody>
          <FormFieldOptions
            form={form}
            name="editorFontSize"
            title="Editor font size"
            onChange={setValue}
            options={[
              { v: '100', l: '100%' },
              { v: '125', l: '125%' },
              { v: '150', l: '150%' },
              { v: '200', l: '200%' },
              { v: '250', l: '250%' },
              { v: '300', l: '300%' },
              { v: '400', l: '400%' },
              { v: '600', l: '600%' },
            ]}
          />

          {/*
          <FormFieldOptions
            form={form}
            name="editorNarrateSelection"
            title="Narrate when cursor moves"
            onChange={setValue}
            options={[
              { v: '0', l: 'Off' },
              { v: '1', l: 'On' },
            ]}
          />
          */}

          <FormFieldOptions
            form={form}
            name="editorLayout"
            title="Buttons layout"
            onChange={setValue}
            options={[
              { v: '1', l: 'English #1' },
              { v: '2', l: 'English #2' },
              { v: '3', l: 'English #3' },
              { v: '4', l: 'Russian' },
            ]}
          />

          <FormFieldOptions
            form={form}
            name="editorClickDelay"
            title="Input cooldown time, in seconds"
            onChange={setValue}
            options={[
              { v: '0', l: '0 s' },
              { v: '0.1', l: '0.1 s' },
              { v: '0.2', l: '0.2 s' },
              { v: '0.3', l: '0.3 s' },
              { v: '0.5', l: '0.5 s' },
              { v: '0.7', l: '0.7 s' },
              { v: '1', l: '1 s' },
            ]}
          />

          <FormFieldOptions
            form={form}
            name="editorNarrateInput"
            title="Narrate input"
            onChange={setValue}
            options={[
              { v: '0', l: 'Off' },
              { v: '1', l: 'On' },
            ]}
          />

        </ModalBody>
      </Modal>
    </>
  );
});
