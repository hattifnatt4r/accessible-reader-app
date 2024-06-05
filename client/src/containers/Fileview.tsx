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
  const isShared = file?.person_id === 0;  

  const paragraphs = store.paragraphs;
  const sentences = store.sentences;

  const fontSize = appStore.userSettings.readerFontSize || '100';
  const cl = {
    'fview': 1,
    ['fview_' + fontSize]: 1,
    'page-w-controls': 1,
  };

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
          {paragraphs.map((p: ReaderParagraphType) => {
            const pcontent = p.content;
            const pID = p.id;
            return (
              <ParagraphWrap key={pID} paragraph={p} id={pID} idSelected={store.textVar.pID} selectionType={store.selectionType}>
                <SelectParagraphButton pIDSelected={store.textVar.pID} onClick={store.selectParagraph} paragraph={p} />
                {store.textVar.pID !== pID && pcontent}
                {store.textVar.pID === pID && sentences.map((s, sID: number) => (
                  <span key={sID} id={'p' + pID + 's' + sID} className={classNames(scl(pID, sID))}>
                    {s.map((w, wID) => <span key={wID} id={'p' + pID + 's' + pID + 'w' + wID} className={classNames(wcl(pID, sID, wID))}>{w} </span>)}
                  </span>
                ))}
                &nbsp;
              </ParagraphWrap>
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


function SelectParagraphButton(props: { pIDSelected: number, onClick: (pID: number) => void, paragraph: ReaderParagraphType }) {
  const { onClick, pIDSelected, paragraph } = props;
  const pID = paragraph.id;
  const selected = pID === pIDSelected;

  if (!paragraph.content && paragraph.type !== 'answer') return null;

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


function ParagraphWrap(props: { paragraph: ReaderParagraphType, children: React.ReactNode, id: number, idSelected: number, selectionType: string }) {
  const { paragraph, children, id, idSelected, selectionType } = props;

  const highlightParagraph = (paragraph.type === 'answer' && !paragraph.content) || selectionType === 'p';
  const pcl = {
    'fview__p': 1,
    'fview__p_selected': paragraph.id === idSelected && highlightParagraph,
    'fview__p_title': paragraph.id === 0,
    'fview__p_question': paragraph.type === 'question',
    'fview__p_answer': paragraph.type === 'answer',
    'fview__p_check': paragraph.type === 'check',
  };

  if (paragraph.type === 'answer') {
    return (
      <div className={classNames(pcl)} id={'p' + id}>
        <div className="fview__p__answer">
          {children}
        </div>
      </div>
    );
  }

  if (paragraph.type === 'check') {
    // todo
    return (
      <div className={classNames(pcl)} id={'p' + id}>
        {children}
      </div>
    );
  }

  return (
    <div className={classNames(pcl)} id={'p' + id}>
      {children}
    </div>
  );
}