import React, { useEffect, useState } from 'react';
import { FilehomeStore } from './FilehomeStore';
import { FilehomeFile } from './FilehomeMisc';
import { observer, useObserver } from 'mobx-react-lite';
import { NavBackButton, NavModal } from '../components/Nav';
import { PageButton } from '../components/PageButton';
import { useNavigate } from 'react-router-dom';
import { FilehomeSettings } from './FilehomeSettings';
import { FilehomeAdd } from './FilehomeAdd';
import { FilehomeEdit } from './FilehomeEdit';
import './Filehome.css';


export const Filehome = observer((props) => {
  const [store, setStore] = useState<FilehomeStore | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const store = new FilehomeStore();
    setStore(store);
  }, []);

  if (!store) return null;

  const selectedFile = store.getFile(store.selectedFileID);
  function openFile() {
    navigate(`/files/${selectedFile?.id}`);
  }

  return (
    <div className="fhome">
      <div className="fhome__files">
        <div className="fhome__fileicons">
          {store?.readerFiles.map(f => f && <FilehomeFile file={f} setFileID={store.setFileID} key={f.id} selected={f.id == selectedFile?.id} />)}
        </div>

        <div className="fhome__magnify">
          {!selectedFile ? <span className="fhome__magnify_empty">Select a file</span> : selectedFile?.name}
        </div>
      </div>

      <div className="fhome__controls">
        <div className="fview__controls-flex">
          <FilehomeSettings />
          <NavBackButton />
          <FilehomeEdit file={selectedFile} />
          <NavModal />

          <FilehomeAdd />
          <PageButton iconName="arrow_right_alt" onClick={openFile} disabled={!selectedFile} />
          <PageButton empty />
          <PageButton empty />
          <PageButton iconName="arrow_left" onClick={() => store.nextPrevFile(-1)} />
          <PageButton iconName="arrow_right" onClick={() => store.nextPrevFile(1)} />
        </div>
      </div>
    </div>
  );
});
