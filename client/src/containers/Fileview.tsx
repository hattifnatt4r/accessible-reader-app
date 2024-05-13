import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import classNames from 'classnames';
import { Icon } from '../components/Icon';
import { FileviewStore } from './FileviewStore';
import { useParams } from 'react-router-dom';
import { FileviewButton } from './FileviewMisc';
import { ModalNav } from './ModalNav';
import { ModalSettings } from './ModalSettings';
import { getSplitParagraph } from './FileviewUtils';
import './Fileview.css';



export const Fileview = observer(() => {
  const [store, setStore] = useState<FileviewStore | null>(null);
  const { fileID } = useParams();
  const appStore = window.app;

  useEffect(() => {
    const s = new FileviewStore({ id: Number(fileID) });
    setStore(s);
  }, []);


  if (!store) return null;
  const file = store?.getFile(Number(fileID));
  if (!file) {
    return <div>File not found</div>;
  }

  const paragraphs = store.paragraphs;
  const sentences = getSplitParagraph(paragraphs[store.textVar.pID]);

  const cl = {
    'fview': 1,
    'fview-12': appStore.userSettings.readerFontSize == 1.25,
    'fview-15': appStore.userSettings.readerFontSize == 1.5,
    'fview-20': appStore.userSettings.readerFontSize == 2,
  };

  const pcl = (pID: number) => ({
    'fview__p': 1,
    'fview__p_selected': pID === store.textVar.pID,
    'fview__title': pID === 0,
  });
  const scl = (pID: number, sID: number) => ({
    'fview__s': 1,
    'fview__s_selected': sID === store.textVar.sID && pID === store.textVar.pID,
  });
  const wcl = (pID: number, sID: number, wID: number) => ({
    'fview__w': 1,
    'fview__w_selected': wID === store.textVar.wID && sID === store.textVar.sID && pID === store.textVar.pID,
  });

  // console.log('p:', toJS(store.textVar));
  return (
    <div className={classNames(cl)}>
      <div className="fview__file">
        <div className="fview__filename">
          {file.folder}/{file.name}
        </div>
        <div className="fview__body">
          {paragraphs.map((p, pID) => (
            <div key={pID} id={'p' + pID} className={classNames(pcl(pID))}>
              {store.textVar.pID !== pID && p}
              {store.textVar.pID == pID && sentences.map((s, sID) => (
                <span key={sID} id={'p' + pID + 's' + sID} className={classNames(scl(pID, sID))}>
                  {s.map((w, wID) => <span key={wID} id={'p' + pID + 's' + pID + 'w' + wID} className={classNames(wcl(pID, sID, wID))}>{w} </span>)}
                </span>
              ))}
              &nbsp;
            </div>
          ))}
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

        <FileviewButton onClick={store.changeSelectionType}>
          Select <br />
          <div>
            {store.selectionType === 'w' && <>&bull;</>}
            {store.selectionType === 's' && <>&bull; &bull;</>}
            {store.selectionType === 'p' && <>&bull; &bull; &bull;</>}
          </div>
        </FileviewButton>

        <FileviewButton iconName="play_circle">
          <Icon name="play_circle"/>
          Play
        </FileviewButton>
        <br />

        <FileviewButton iconName="arrow_left" onClick={() => store.changeSelection(-1)}>
          <Icon name="arrow_left"/>
          Prev
        </FileviewButton>

        <FileviewButton iconName="arrow_right" onClick={() => store.changeSelection(1)}>
          <Icon name="arrow_right"/>
          Next
        </FileviewButton>
      </div>
    </div>
  );
});
