import React, { useEffect, useState } from 'react';
import { FilehomeStore } from './FilehomeStore';
import { FilehomeFile } from './FilehomeFile';
import { observer, useObserver } from 'mobx-react-lite';
import './Filehome.css';

export const Filehome = observer((props) => {
  const [store, setStore] = useState<FilehomeStore | null>(null);

  useEffect(() => {
    const store = new FilehomeStore();
    setStore(store);
  }, []);

  if (!store) return null;
  return (
    <div className="filehome">
      <div className="filehome__files">
        <div className="filehome__fileicons">
          {store?.readerFiles.map(f => <FilehomeFile file={f} setFileID={store.setFileID} key={f?.id} />)}
        </div>

        <div className="filehome__magnify">
          Filename: {store.getFile(store.fileSelected)?.name}
        </div>
      </div>

      <div className="filehome__nav">
        Buttons
      </div>
    </div>
  );
});
