import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { EntryType, ReaderFileType } from '../consts/dataTypes';
import { SelectionTypeType, getSplitParagraph } from './FileviewUtils';
import { post } from '../utils/query';
import { speakAll } from '../utils/narrate';
import { getNarrateSupported } from '../utils/misc';
import { Icon } from '../components/Icon';
import { NavBackButton, NavModal } from '../components/Nav';
import { PageButton, PageControls } from '../components/PageControls';
import { FileviewSettings } from './FileviewSettings';
import './ChatView.css';


export const ChatView = observer(() => {
  const { fileID } = useParams();
  const [file, setFile] = useState<ReaderFileType | null>(null);
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [message, setMessage] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [selectionType, setSelectionType] = useState<SelectionTypeType>(() =>
    (localStorage.getItem('readerSelectionType') as SelectionTypeType) || 's'
  );
  const [sentences, setSentences] = useState<string[][]>([]);
  const [sID, setSID] = useState(0);
  const [wID, setWID] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const appStore = window.app;
  const currentUserId = appStore.userInfo.id;
  const bottomRef = useRef<HTMLDivElement>(null);
  const narrateSupported = getNarrateSupported();

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const loadData = async () => {
    const fileRes = await post('file', { id: Number(fileID) });
    if (fileRes.value?.length) setFile(fileRes.value[0]);
    const entryRes = await post('entry_list', { file_id: Number(fileID) });
    if (entryRes.status === 'success') setEntries(entryRes.value || []);
  };

  const narrateAt = (entry: EntryType, split: string[][], si: number, wi: number) => {
    if (!narrateSupported) return;
    setIsSpeaking(true);
    setIsPaused(false);
    const onEnd = () => { setIsSpeaking(false); setIsPaused(false); };
    if (selectionType === 'p') {
      speakAll(entry.content.split('.').filter(Boolean), onEnd);
    } else if (selectionType === 's') {
      speakAll([split[si]?.join(' ') || ''], onEnd);
    } else {
      speakAll([split[si]?.[wi] || ''], onEnd);
    }
  };

  const selectEntry = (entry: EntryType, si = 0, wi = 0) => {
    const p = { id: entry.id, content: entry.content, type: '' };
    const split = getSplitParagraph(p);
    setSentences(split);
    setSID(si);
    setWID(wi);
    setSelectedEntryId(entry.id);
    if (appStore.userSettings.readerNarrateSelection !== 0) {
      narrateAt(entry, split, si, wi);
    }
  };

  const narrateAll = () => {
    if (!narrateSupported || !entries.length) return;
    setIsSpeaking(true);
    setIsPaused(false);
    const texts = entries.flatMap(e => e.content.split('.').filter(Boolean));
    speakAll(texts, () => { setIsSpeaking(false); setIsPaused(false); });
  };

  const narratePause = () => {
    speechSynthesis.pause();
    setIsSpeaking(false);
    setIsPaused(true);
  };

  const narrateResume = () => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsSpeaking(true);
      setIsPaused(false);
    } else {
      narrateAll();
    }
  };

  const changeSelection = (diff: number) => {
    if (!entries.length) return;
    const currentEntry = entries.find(e => e.id === selectedEntryId);
    const entryIdx = entries.findIndex(e => e.id === selectedEntryId);

    if (selectionType === 's' && currentEntry) {
      const newSID = sID + diff;
      if (newSID >= 0 && newSID < sentences.length) {
        setSID(newSID);
        setWID(0);
        narrateAt(currentEntry, sentences, newSID, 0);
        return;
      }
    }

    if (selectionType === 'w' && currentEntry) {
      const newWID = wID + diff;
      if (newWID >= 0 && newWID < (sentences[sID]?.length || 0)) {
        setWID(newWID);
        narrateAt(currentEntry, sentences, sID, newWID);
        return;
      }
      const newSID = sID + diff;
      if (newSID >= 0 && newSID < sentences.length) {
        const targetWID = diff > 0 ? 0 : (sentences[newSID]?.length - 1) || 0;
        setSID(newSID);
        setWID(targetWID);
        narrateAt(currentEntry, sentences, newSID, targetWID);
        return;
      }
    }

    // advance to next/prev entry
    const nextIdx = entryIdx === -1
      ? (diff > 0 ? 0 : entries.length - 1)
      : Math.min(Math.max(0, entryIdx + diff), entries.length - 1);
    if (nextIdx === entryIdx) return;
    const nextEntry = entries[nextIdx];
    const split = getSplitParagraph({ id: nextEntry.id, content: nextEntry.content, type: '' });
    const targetSID = diff > 0 ? 0 : split.length - 1;
    const targetWID = diff > 0 ? 0 : (split[targetSID]?.length - 1) || 0;
    selectEntry(nextEntry, targetSID, targetWID);
  };

  const cycleSelectionType = () => {
    const next: SelectionTypeType = selectionType === 'w' ? 's' : selectionType === 's' ? 'p' : 'w';
    setSelectionType(next);
    localStorage.setItem('readerSelectionType', next);

    const currentEntry = entries.find(e => e.id === selectedEntryId);
    if (!currentEntry) return;

    // w → s: stay at same sentence, reset word
    // s → p: stay at same entry
    // p → w: stay at same entry, first sentence first word
    const targetWID = next === 'w' ? 0 : wID;
    setWID(targetWID);
    narrateAt(currentEntry, sentences, sID, targetWID);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    await post('entry_add', { file_id: Number(fileID), content: message.trim() });
    setMessage('');
    loadData();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={'chatview page-w-controls fview_' + (appStore.userSettings.readerFontSize || '100')}>
      <div className="chatview__main">
        <div className="chatview__header">{file?.title || ''}</div>

        <div className="chatview__messages">
          {entries.map((entry) => {
            const isOwn = entry.person_id === currentUserId;
            const isSelected = entry.id === selectedEntryId;
            return (
              <div key={entry.id} className={'chatview__msg-wrap' + (isOwn ? ' chatview__msg-wrap_right' : ' chatview__msg-wrap_left')}>
                <div className="chatview__msg-time">{formatTime(entry.created_at)}</div>
                <div className="chatview__msg-row">
                  <div
                    className={'chatview__circle' + (isSelected ? ' chatview__circle_selected' : '')}
                    onClick={() => selectEntry(entry)}
                  >
                    <Icon name="radio_button_unchecked" filled />
                  </div>
                  <div className={'chatview__msg' + (isOwn ? ' chatview__msg_own' : ' chatview__msg_other') + (isSelected && selectionType === 'p' ? ' chatview__msg_selected' : '')}>
                    {isSelected && selectionType !== 'p'
                      ? sentences.map((words, si) => (
                          <span key={si} className={'chatview__sentence' + (si === sID && selectionType === 's' ? ' chatview__sentence_selected' : '')}>
                            {selectionType === 'w'
                              ? words.map((word, wi) => (
                                  <span key={wi} className={'chatview__word' + (si === sID && wi === wID ? ' chatview__word_selected' : '')}>{word} </span>
                                ))
                              : words.join(' ')}
                            {' '}
                          </span>
                        ))
                      : entry.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="chatview__input-bar">
          <textarea
            className="chatview__input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
          />
          <button className="button" onClick={handleSend}>Send</button>
        </div>
      </div>

      <PageControls>
        <FileviewSettings viewerMode="view" onModeChange={() => {}} canEdit={false} />
        <NavBackButton />
        <PageButton empty />
        <NavModal />
        <PageButton empty />

        {isSpeaking && <PageButton onClick={narratePause} iconSvgname="pause" />}
        {!isSpeaking && <PageButton onClick={isPaused ? narrateResume : narrateAll} iconSvgname="play" disabled={!narrateSupported} />}

        <PageButton onClick={cycleSelectionType} className="fview__btn-select">
          <div className="icon-mask page-button__svg">
            <div className="fview__btn-select__text">
              Select <br />
              <div>
                {selectionType === 'w' && <>&bull;</>}
                {selectionType === 's' && <>&bull; &bull;</>}
                {selectionType === 'p' && <>&bull; &bull; &bull;</>}
              </div>
            </div>
          </div>
        </PageButton>

        {isSpeaking && <PageButton onClick={narratePause} iconSvgname="pause" />}
        {!isSpeaking && <PageButton onClick={narrateResume} iconSvgname="marketing" disabled={!narrateSupported} />}

        <PageButton iconSvgname="arrow-back" onClick={() => changeSelection(-1)} />
        <PageButton iconSvgname="arrow-forward" onClick={() => changeSelection(1)} />
      </PageControls>
    </div>
  );
});
