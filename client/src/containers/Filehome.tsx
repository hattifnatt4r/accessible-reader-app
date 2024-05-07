import React, { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { FilehomeStore } from './FilehomeStore';
import { FilehomeButton, FilehomeFile } from './FilehomeMisc';
import { observer, useObserver } from 'mobx-react-lite';
import './Filehome.css';
import { ModalNav } from './ModalNav';

export const Filehome = observer((props) => {
  const [store, setStore] = useState<FilehomeStore | null>(null);

  useEffect(() => {
    const store = new FilehomeStore();
    setStore(store);
  }, []);

  if (!store) return null;
  return (
    <div className="fhome">
      <div className="fhome__files">
        <div className="fhome__fileicons">
          {store?.readerFiles.map(f => <FilehomeFile file={f} setFileID={store.setFileID} key={f?.id} />)}
        </div>

        <div className="fhome__magnify">
          Filename: {store.getFile(store.fileSelected)?.name}
        </div>
      </div>

      <div className="fhome__nav">
        <FilehomeButton iconName="menu">
          <ModalNav>
            Nav
          </ModalNav>
        </FilehomeButton>

        <FilehomeButton iconName="person">
          User
        </FilehomeButton>

        <FilehomeButton iconName="settings">
          Settings
        </FilehomeButton>

        <FilehomeButton iconName="group">
          Messages
        </FilehomeButton>

        <FilehomeButton iconName="arrow_right_alt">
          Enter
        </FilehomeButton>

        <FilehomeButton iconName="add">
          New
        </FilehomeButton>

        <FilehomeButton iconName="arrow_left">
          Prev
        </FilehomeButton>

        <FilehomeButton iconName="arrow_right">
          Right
        </FilehomeButton>
      </div>
    </div>
  );
});
