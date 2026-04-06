import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { EntryType, ReaderFileType, UserInfoType } from '../consts/dataTypes';
import { SelectionTypeType, getSplitParagraph } from './FileviewUtils';
import { post } from '../utils/query';
import fixWebmDuration from 'fix-webm-duration';
import { speakAll } from '../utils/narrate';
import { getNarrateSupported } from '../utils/misc';
import { Icon } from '../components/Icon';
import { AudioMessage } from '../components/AudioMessage';
import { ImagePreview } from '../components/ImagePreview';
import { NavBackButton, NavChatPerson, NavModal } from '../components/Nav';
import { PageButton, PageControls } from '../components/PageControls';
import { FileviewSettings } from './FileviewSettings';
import { Editor } from './Editor';
import './ChatView.css';


export const ChatView = observer(() => {
  const { fileID } = useParams();
  const [file, setFile] = useState<ReaderFileType | null>(null);
  const [otherPerson, setOtherPerson] = useState<UserInfoType | null>(null);
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
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingPhase, setRecordingPhase] = useState<'recording' | 'preview'>('recording');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<{ file: File; url: string }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const lastEntryIdRef = useRef<number>(0);
  const appStore = window.app;
  const currentUserId = appStore.userInfo.id;
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const recordingStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const narrateSupported = getNarrateSupported();

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (showEditor) return;
    const pollRef = setInterval(async () => {
      const afterId = lastEntryIdRef.current;
      const entryRes = await post('entry_list', { file_id: Number(fileID), after_id: afterId });
      if (entryRes.status === 'success') {
        const newEntries: EntryType[] = entryRes.value || [];
        if (newEntries.length) {
          lastEntryIdRef.current = newEntries[newEntries.length - 1].id;
          setEntries(prev => [...prev, ...newEntries]);
        }
      }
    }, 10000);
    return () => clearInterval(pollRef);
  }, [showEditor]);

  useEffect(() => {
    entries.forEach(e => {
      const audioKey = getAudioKey(e.content);
      if (audioKey && !audioUrls[audioKey]) loadAudioUrl(audioKey);
      const imgKey = getImageKey(e.content);
      if (imgKey && !imageUrls[imgKey]) loadImageUrl(imgKey);
    });
  }, [entries]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const loadData = async () => {
    const fileRes = await post('file', { id: Number(fileID) });
    const fileData = fileRes.value?.[0];
    if (fileData) {
      setFile(fileData);
      const otherPersonId = fileData.person_1 === appStore.userInfo.id ? fileData.person_2 : fileData.person_1;
      console.log('other person:', otherPersonId, fileData);
      if (otherPersonId) {
        const personRes = await post('person_by_id', { id: otherPersonId });
        if (personRes.status === 'success') {
          const person = personRes.value;
          if (person.image_url) {
            const urlRes = await post('image_url', { key: person.image_url });
            person.image_url = urlRes.value?.[0]?.url || null;
          }
          setOtherPerson(person);
        }
      }
    }
    const entryRes = await post('entry_list', { file_id: Number(fileID) });
    if (entryRes.status === 'success') {
      const loaded: EntryType[] = entryRes.value || [];
      setEntries(loaded);
      if (loaded.length) lastEntryIdRef.current = loaded[loaded.length - 1].id;
    }
  };

  const getAudioKey = (content: string) => {
    const m = content.match(/^\[audio:([^:\]]+)/);
    return m ? m[1] : null;
  };

  const loadAudioUrl = async (key: string) => {
    const res = await post('audio_url', { key });
    if (res.status === 'success' && res.value?.[0]?.url) {
      setAudioUrls(prev => ({ ...prev, [key]: res.value![0].url }));
    }
  };

  const getImageKey = (content: string) => {
    const m = content.match(/^\[image:([^:\]]+)/);
    return m ? m[1] : null;
  };

  const loadImageUrl = async (key: string) => {
    const res = await post('image_url', { key });
    if (res.status === 'success' && res.value?.[0]?.url) {
      setImageUrls(prev => ({ ...prev, [key]: res.value![0].url }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const handleImageRemove = (index: number) => {
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleImageCancel = () => {
    imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
  };

  const compressToUnder1MB = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const MAX = 1024 * 1024;
      if (file.size <= MAX) { resolve(file); return; }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, Math.sqrt(MAX / file.size));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        const tryBlob = (q: number) => {
          canvas.toBlob((blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= MAX || q <= 0.3) {
              resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              tryBlob(q - 0.1);
            }
          }, 'image/jpeg', q);
        };
        tryBlob(0.85);
      };
      img.src = url;
    });
  };

  const handleImageSend = async (files: File[]) => {
    const apiUrl = (window as any).apiConfig?.apiUrl || '';
    for (const rawFile of files) {
      const file = await compressToUnder1MB(rawFile);
      const formData = new FormData();
      formData.append('file', file);
      let data: any;
      try {
        const res = await fetch(apiUrl + 'image_upload', {
          method: 'POST', mode: 'cors', credentials: 'include', body: formData,
        });
        data = await res.json();
      } catch {
        throw new Error(`Failed to upload "${file.name}" — file may be too large`);
      }
      if (data.status !== 'success') {
        throw new Error(data.error || `Failed to upload "${file.name}"`);
      }
      await post('entry_add', { file_id: Number(fileID), content: `[image:${data.key}]` });
    }
    imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
    loadData();
  };

  const formatRecordingTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const openRecordingModal = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = handleRecordingStop;
      recorder.start();
      mediaRecorderRef.current = recorder;
      recordingStartRef.current = Date.now();
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
      setRecordingPhase('recording');
      setPreviewUrl(null);
      setShowRecordingModal(true);
    } catch (err) {
      console.error('Microphone access denied', err);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
  };

  const handleRecordingStop = async () => {
    const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    const duration = Date.now() - recordingStartRef.current;
    const rawBlob = new Blob(audioChunksRef.current, { type: mimeType });
    const blob = mimeType.includes('webm')
      ? await fixWebmDuration(rawBlob, duration)
      : rawBlob;
    audioBlobRef.current = blob;
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setRecordingPhase('preview');
  };

  const handleDiscard = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    audioBlobRef.current = null;
    setPreviewUrl(null);
    setShowRecordingModal(false);
  };

  const handleSaveAudio = async () => {
    const blob = audioBlobRef.current;
    if (!blob) return;
    const mimeType = blob.type || 'audio/webm';
    const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
    const formData = new FormData();
    formData.append('file', blob, `audio.${ext}`);
    setIsUploading(true);
    try {
      const apiUrl = (window as any).apiConfig?.apiUrl || '';
      const res = await fetch(apiUrl + 'audio_upload', {
        method: 'POST', mode: 'cors', credentials: 'include', body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        await post('entry_add', { file_id: Number(fileID), content: `[audio:${data.key}]` });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        audioBlobRef.current = null;
        setPreviewUrl(null);
        setShowRecordingModal(false);
        loadData();
      }
    } finally {
      setIsUploading(false);
    }
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
    if (getAudioKey(entry.content)) {
      setSelectedEntryId(entry.id);
      setSentences([]);
      return;
    }
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

  const handleEditorSend = async (text: string) => {
    if (!text.trim()) return;
    await post('entry_add', { file_id: Number(fileID), content: text.trim() });
    setShowEditor(false);
    loadData();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      setShowTextInput(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className={'chatview page-w-controls fview_' + (appStore.userSettings.readerFontSize || '100')}>
      <div className="chatview__main">

        <div className="chatview__messages">
          <div className="chatview__header">{[otherPerson?.fullname || otherPerson?.login_name, file?.title].filter(Boolean).join(' — ')}</div>
          {entries.map((entry) => {
            const isOwn = entry.person_id === currentUserId;
            const isSelected = entry.id === selectedEntryId;
            return (
              <div key={entry.id} className={'chatview__msg-wrap' + (isOwn ? ' chatview__msg-wrap_right' : ' chatview__msg-wrap_left')}>
                {/* <div className="chatview__msg-time">{formatTime(entry.created_at)}</div> */}
                <div className="chatview__msg-row">
                  <div
                    className={'chatview__circle' + (isSelected ? ' chatview__circle_selected' : '')}
                    onClick={() => selectEntry(entry)}
                  >
                    <Icon name="radio_button_unchecked" filled />
                  </div>
                  <div className={'chatview__msg' + (isOwn ? ' chatview__msg_own' : ' chatview__msg_other') + (isSelected && selectionType === 'p' ? ' chatview__msg_selected' : '')}>
                    {(() => {
                      const audioKey = getAudioKey(entry.content);
                      if (audioKey) {
                        const url = audioUrls[audioKey];
                        if (!url) return <span className="chatview__audio-loading">...</span>;
                        return <AudioMessage url={url} own={isOwn} />;
                      }
                      const imgKey = getImageKey(entry.content);
                      if (imgKey) {
                        const url = imageUrls[imgKey];
                        if (!url) return <span className="chatview__audio-loading">...</span>;
                        return <img src={url} alt="" className="chatview__image" />;
                      }
                      return isSelected && selectionType !== 'p'
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
                        : entry.content;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        </div>

        

      {imagePreviews.length > 0 && (
        <ImagePreview
          previews={imagePreviews}
          onRemove={handleImageRemove}
          onCancel={handleImageCancel}
          onSend={handleImageSend}
        />
      )}

      {showTextInput && (
        <div className="rec-modal__overlay">
          <div className="rec-modal">
            <textarea
              className="chatview__input chatview__text-popup-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={4}
              autoFocus
            />
            <div className="rec-modal__actions">
              <button className="button button_secondary" onClick={() => { setShowTextInput(false); setMessage(''); }}>
                Cancel
              </button>
              <button className="button" onClick={() => { handleSend(); setShowTextInput(false); }} disabled={!message.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecordingModal && (
        <div className="rec-modal__overlay">
          <div className="rec-modal">
            {recordingPhase === 'recording' ? (
              <>
                <div className="rec-modal__indicator">
                  <span className="rec-modal__dot" />
                  <span className="rec-modal__timer">{formatRecordingTime(recordingSeconds)}</span>
                </div>
                <button className="button rec-modal__stop" onClick={stopRecording}>
                  <Icon name="stop" /> Stop
                </button>
              </>
            ) : (
              <>
                <AudioMessage url={previewUrl || ''} />
                <div className="rec-modal__actions">
                  <button className="button button_secondary" onClick={handleDiscard} disabled={isUploading}>
                    Discard
                  </button>
                  <button className="button" onClick={handleSaveAudio} disabled={isUploading}>
                    {isUploading ? '...' : 'Send'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <PageControls>
        <NavChatPerson person={otherPerson} title={file?.title || ''} />
        <NavBackButton />
        <FileviewSettings viewerMode="view" onModeChange={() => {}} canEdit={false} />
        

        {/* isSpeaking && <PageButton onClick={narratePause} iconSvgname="pause" /> */}

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
        <PageButton iconSvgname="arrow-back" onClick={() => changeSelection(-1)} />
        <PageButton iconSvgname="arrow-forward" onClick={() => changeSelection(1)} />

        {isSpeaking && <PageButton onClick={narratePause} iconSvgname="pause" />}
        {!isSpeaking && <PageButton onClick={narrateResume} iconSvgname="marketing" disabled={!narrateSupported} />}

        <PageButton onClick={() => imageInputRef.current?.click()} iconSvgname="image" className="page-button_chat" />
        <PageButton onClick={openRecordingModal} iconSvgname="mic" className="page-button_chat" />
        <PageButton onClick={() => setShowEditor(true)} iconSvgname="edit-button" className="page-button_chat"/>
      </PageControls>

      <Editor
        open={showEditor}
        text=""
        toggle={() => setShowEditor(false)}
        save={handleEditorSend}
        isChat
      />
    </div>
  );
});
