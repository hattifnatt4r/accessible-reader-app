import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Icon } from '../components/Icon';
import { FileviewStore } from './FileviewStore';
import { useParams } from 'react-router-dom';
import { FileviewButton } from './FileviewMisc';
import { ModalNav } from './ModalNav';
import { ModalSettings } from './ModalSettings';
import './Fileview.css';


function getDisplayText(text: string) {
  let newText = text.replaceAll('<br/>', '<br>').replaceAll('\n', '<br>').replaceAll('\r\n', '<br>');
  const paragraphs = newText.split('<br>');
  return (
    <>
      {paragraphs.map((p, ii) => <div key={ii}>{p}&nbsp;</div>)}
    </>
  );
}

export const Fileview = observer(() => {
  const [store, setStore] = useState<FileviewStore | null>(null);
  const { fileID } = useParams();
  const appStore = window.app;

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

  const displayText = getDisplayText(store?.text?.text || '');

  const cl = {
    'fview': 1,
    'fview-12': appStore.userSettings.readerFontSize == 1.25,
    'fview-15': appStore.userSettings.readerFontSize == 1.5,
    'fview-20': appStore.userSettings.readerFontSize == 2,
  };

  return (
    <div className={classNames(cl)}>
      <div className="fview__file">
        <div className="fview__filename">
          {file?.name}
        </div>
        <div className="fview__title">
          {file?.title}
        </div>
        <div className="fview__body">
          {displayText}
        </div>
      </div>

      <div className="fview__nav">
        <FileviewButton>
          <ModalNav>
            <Icon name="menu"/>
            Nav
          </ModalNav>
        </FileviewButton>
        <FileviewButton>
          <ModalSettings>
            <Icon name="settings"/>
            Settings
          </ModalSettings>
        </FileviewButton>

        <FileviewButton>
          <Icon name="edit"/>
          Read All
        </FileviewButton>

        <FileviewButton>
          <Icon name="edit"/>
          Edit
        </FileviewButton>
        <br />

        <FileviewButton>
          <Icon name="more_horiz"/>
          Select
        </FileviewButton>

        <FileviewButton iconName="play_circle">
          <Icon name="play_circle"/>
          Play
        </FileviewButton>
        <br />

        <FileviewButton iconName="arrow_left">
          <Icon name="arrow_left"/>
          Prev
        </FileviewButton>

        <FileviewButton iconName="arrow_right">
          <Icon name="arrow_right"/>
          Next
        </FileviewButton>
      </div>
    </div>
  );
});
