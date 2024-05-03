import React, { useEffect, useState } from 'react';
import { FileviewStore } from './FileviewStore';
import { useParams } from 'react-router-dom';
import './Fileview.css';

export function Fileview() {
  const [store, setStore] = useState<FileviewStore | null>(null);
  const { fileID } = useParams();

  useEffect(() => {
    const s = new FileviewStore({ id: Number(fileID) });
    setStore(s);
  }, []);

  return (
    <div className="fileview">
      <div className="fileview__file">
        <div className="fileview__title">
          {store?.text?.text}
        </div>
        <div className="fileview__body">
          {store?.text?.text}
        </div>
      </div>

      <div className="fileview__nav">
        Buttons
      </div>
    </div>
  );
}
