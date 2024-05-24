import React, { useEffect, useState } from 'react';
import { FilehomeStore } from './FilehomeStore';
import { FilehomeFile } from './FilehomeMisc';
import { observer, useObserver } from 'mobx-react-lite';
import { NavBackButton, NavModal } from '../components/Nav';
import { PageButton } from '../components/PageButton';
import './Filehome.css';


export const Filehome = observer((props) => {
  const [store, setStore] = useState<FilehomeStore | null>(null);

  useEffect(() => {
    const store = new FilehomeStore();
    setStore(store);
  }, []);

  if (!store) return null;

  const selectedFile = store.getFile(store.fileSelected)?.name;
  return (
    <div className="fhome">
      <div className="fhome__files">
        <div className="fhome__fileicons">
          {store?.readerFiles.map(f => <FilehomeFile file={f} setFileID={store.setFileID} key={f?.id} />)}
        </div>

        <div className="fhome__magnify">
          {!selectedFile ? <span className="fhome__magnify_empty">Select a file</span> : selectedFile}
        </div>
      </div>

      <div className="fhome__controls">
        <div className="fview__controls-flex">
          <PageButton iconName="settings" />
          <NavBackButton />
          <PageButton empty />
          <NavModal />

          <PageButton iconName="arrow_right_alt" />
          <PageButton iconName="add" />
          <PageButton iconName="arrow_left" />
          <PageButton iconName="arrow_right" />
        </div>
      </div>
    </div>
  );
});
