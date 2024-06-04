import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { getNarrateSupported } from '../utils/misc';
import { ReaderParagraphType } from '../consts/dataTypes';
import { Icon } from '../components/Icon';
import { PageButton, PageControls } from '../components/PageControls';
import { FileviewStore } from './FileviewStore';
import { NavBackButton, NavModal } from '../components/Nav';
import { FileviewSettings } from './FileviewSettings';
import { Editor } from './Editor';
import './Fileview.css';



export const Fileview = observer(() => {
  const [store, setStore] = useState<FileviewStore | null>(null);
  const { fileID } = useParams();
  const appStore = window.app;
  const narrateSupported = getNarrateSupported();

  useEffect(() => {
    const s = new FileviewStore({ id: Number(fileID) });
    setStore(s);
  }, []);


  if (!store) return null;
  const file = store?.file;
  const isShared = file?.person_id == 0;  

  const paragraphs = store.paragraphs;
  const sentences = store.sentences;

  const fontSize = appStore.userSettings.readerFontSize || '100';
  const cl = {
    'fview': 1,
    ['fview_' + fontSize]: 1,
    'page-w-controls': 1,
  };

  const pcl = (pID: number) => ({
    'fview__p': 1,
    'fview__p_selected': pID === store.textVar.pID && store.selectionType === 'p',
    'fview__title': pID === 0,
  });
  const scl = (pID: number, sID: number) => ({
    'fview__s': 1,
    'fview__s_selected': sID === store.textVar.sID && pID === store.textVar.pID && store.selectionType === 's',
  });
  const wcl = (pID: number, sID: number, wID: number) => ({
    'fview__w': 1,
    'fview__w_selected': wID === store.textVar.wID && sID === store.textVar.sID && pID === store.textVar.pID && store.selectionType === 'w',
  });

  return (
    <div className={classNames(cl)}>
      <div className="fview__file">
        <div className="fview__filename">
          {file?.folder}/{file?.filename} {isShared && "(View-only)"}
        </div>
        <div className="fview__body">
          {paragraphs.map((p: ReaderParagraphType, pID: number) => {
            const pcontent = p.content;
            return (
              <div key={pID} id={'p' + pID} className={classNames(pcl(pID))}>
                <SelectParagraphButton pID={pID} pIDSelected={store.textVar.pID} onClick={store.selectParagraph} paragraph={pcontent} />
                {store.textVar.pID !== pID && pcontent}
                {store.textVar.pID === pID && sentences.map((s, sID: number) => (
                  <span key={sID} id={'p' + pID + 's' + sID} className={classNames(scl(pID, sID))}>
                    {s.map((w, wID) => <span key={wID} id={'p' + pID + 's' + pID + 'w' + wID} className={classNames(wcl(pID, sID, wID))}>{w} </span>)}
                  </span>
                ))}
                &nbsp;
              </div>
            );
          })}
        </div>
      </div>

      <PageControls>
        <FileviewSettings />
        <NavBackButton />
        <PageButton empty />
        <NavModal />

        <PageButton onClick={store.toggleEdit} iconSvgname="edit-button" />

        {store.isSpeaking && <PageButton onClick={store.narratePause} iconSvgname="pause" />}
        {!store.isSpeaking && <PageButton onClick={store.isPaused ? store.narrateResume : store.narrateAll} iconSvgname="play" disabled={!narrateSupported} />}

        <PageButton onClick={store.changeSelectionType}>
          Select <br />
          <div>
            {store.selectionType === 'w' && <>&bull;</>}
            {store.selectionType === 's' && <>&bull; &bull;</>}
            {store.selectionType === 'p' && <>&bull; &bull; &bull;</>}
          </div>
        </PageButton>

        {store.isSpeaking && (
          <PageButton onClick={store.narratePause} iconSvgname="pause" />
        )}
        {!store.isSpeaking && (
          <PageButton onClick={store.narrateResume} iconSvgname="marketing" disabled={!narrateSupported} />
        )}

        <PageButton iconSvgname="arrow-back" onClick={() => store.changeSelection(-1)} />
        <PageButton iconSvgname="arrow-forward" onClick={() => store.changeSelection(1)} />
      </PageControls>

      {store.isEditing && <Editor open={store.isEditing} text={store.getSelectedText()} toggle={store.toggleEdit} save={store.save} readonly={isShared} />}
    </div>
  );
});

function SelectParagraphButton(props: { pID: number, pIDSelected: number, onClick: (pID: number) => void, paragraph: string }) {
  const { onClick, pID, pIDSelected, paragraph } = props;
  const selected = pID === pIDSelected;

  if (!paragraph) return null;

  const cl = {
    'fview__select-p-btn': 1,
    'fview__select-p-btn_selected': selected,
  };

  return (
    <div className={classNames(cl)} onClick={() => onClick(pID)}>
      <Icon name="radio_button_unchecked" filled />
    </div>
  );
}
