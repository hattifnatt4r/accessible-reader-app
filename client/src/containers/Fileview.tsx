import React, { useEffect, useState } from 'react';
import { FileviewStore } from './FileviewStore';
import { useParams } from 'react-router-dom';
import './Fileview.css';
import { FileviewButton } from './FileviewMisc';

export function Fileview() {
  const [store, setStore] = useState<FileviewStore | null>(null);
  const { fileID } = useParams();

  useEffect(() => {
    const s = new FileviewStore({ id: Number(fileID) });
    setStore(s);
  }, []);

  if (!fileID) return null;

  const file = store?.getFileTitle(Number(fileID));
  if (!file) {
    return (
      <div>
        File not found
      </div>
    );
  }

  return (
    <div className="fview">
      <div className="fview__file">
        <div className="fview__filename">
          {file?.name}
        </div>
        <div className="fview__title">
          {file?.title}
        </div>
        <div className="fview__body">
          {store?.text?.text}
        </div>
      </div>

      <div className="fview__nav">
        <FileviewButton iconName="menu">
          Nav
        </FileviewButton>

        <FileviewButton>
          Read All
        </FileviewButton>

        <FileviewButton iconName="edit">
          Edit
        </FileviewButton>

        <FileviewButton>
        </FileviewButton>

        <FileviewButton iconName="more_horiz">
          Select
        </FileviewButton>

        <FileviewButton iconName="play_circle">
          Play/pause
        </FileviewButton>

        <FileviewButton iconName="arrow_left">
          Prev
        </FileviewButton>

        <FileviewButton iconName="arrow_right">
          Next
        </FileviewButton>
      </div>
    </div>
  );
}
