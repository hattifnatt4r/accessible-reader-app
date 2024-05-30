import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FilesStore } from './FilesStore';
import { FilesFile, FilesEdit, FilesAdd } from './FilesMisc';
import { NavBackButton, NavModal } from '../components/Nav';
import { PageButton, PageControls } from '../components/PageControls';
import { useNavigate } from 'react-router-dom';
import { FilesSettings } from './FilesSettings';
import './Files.css';


export const Files = observer((props) => {
  const [store, setStore] = useState<FilesStore | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const store = new FilesStore();
    setStore(store);
  }, []);

  if (!store) return null;

  const selectedFile = store.getFile(store.selectedFileID);
  function openFile() {
    navigate(`/files/${selectedFile?.id}`);
  }

  return (
    <div className="fhome page-w-controls">
      <div className="fhome__files">
        <div className="fhome__fileicons">
          {store?.readerFiles.map(f => f && <FilesFile file={f} setFileID={store.setFileID} key={f.id} selected={f.id === selectedFile?.id} />)}
        </div>

        <div className="fhome__magnify">
          {!selectedFile ? <span className="fhome__magnify_empty">Select a file</span> : selectedFile?.filename}
        </div>
      </div>

      <PageControls>
        <FilesSettings />
        <NavBackButton />
        <FilesEdit file={selectedFile} onUpdated={store.loadFiles} />
        <NavModal />

        <FilesAdd onUpdated={store.loadFiles} />
        <PageButton iconSvgname="right2" onClick={openFile} disabled={!selectedFile} />
        <PageButton empty />
        <PageButton empty />
        <PageButton iconSvgname="arrow-back" onClick={() => store.nextPrevFile(-1)} />
        <PageButton iconSvgname="arrow-forward" onClick={() => store.nextPrevFile(1)} />
      </PageControls>
    </div>
  );
});
