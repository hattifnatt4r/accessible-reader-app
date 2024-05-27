import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon } from '../components/Icon';
import { EditorSettings } from './EditorSettings';
import { getTextAroundCursor } from './EditorUtils';
import './Editor.css';

type CharType = { id: string, val: string, label: string };
const simpleChars: string[] = 'abcdefghijklmnopqrstuvwxyz.,'.split('');
let otherChars : CharType[] = [
  { id: 'space', val: ' ', label: '_' },
];
const allChars = [...otherChars, ...simpleChars.map(char => ({ id: char, val: char, label: char }))];
const layouts = [
  { id: 1,
    cols: 9,
    rows: 5,
    keys: ['reset', 'settings', '', 'save', '', 'p', 'read', '',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.',
      '123', '', 'space', 'prev', 'next',
    ],
    keysTop: ['exit', 'erase'],
    doubleWidth: ['prev', 'next', 'read'],
    tripleWidth: ['space'],
  },
  { id: 2,
    cols: 9,
    rows: 5,
    keys: ['reset', 'settings', '', 'save', '', 'p', 'read', '',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.',
      '123', '', 'space', 'prev', 'next',
    ],
    keysTop: ['exit', 'erase'],
    doubleWidth: ['prev', 'next', 'read'],
    tripleWidth: ['space'],
  }
];


export const Editor = observer((props: { open: boolean, text: string, toggle: () => void, save: (textEdited: string) => void }) => {
  const { open, text, toggle, save } = props;
  const [textvalue, setTextvalue] = useState<string>('');
  const [cursor, setCursor] = useState<number>(0);
  const appStore = window.app;

  
  function handleNext() {
    if (cursor < textvalue.length) {
      setCursor(cursor + 1);
    }
  }
  function handlePrev() {
    if (cursor > 0) {
      setCursor(cursor - 1);
    }
  }
  function handleErase() {
    if (cursor > 0) {
      setTextvalue(textvalue.substring(0, cursor-1) + textvalue.substring(cursor, textvalue.length));
      setCursor(cursor - 1);
    }
  }
  function handleEnterChar(char: string) {
    setTextvalue(textvalue.substring(0, cursor) + char + textvalue.substring(cursor, textvalue.length));
    setCursor(cursor + 1);
  }
  function handleSave() {
    save(textvalue);
  }
  function handleReset() {
    setTextvalue(text);
    setCursor(0);
  }
  function handleRead() {
    
  }
  function handleToggleView() {

  }

  function onKeydown(event: KeyboardEvent) {
    // support keyboard input
    console.log('code:', event.key);
    const key = event.key;
    if (key === 'Backspace') { document.getElementById('fedit-erase')?.click(); }
    if (key === 'ArrowRight') { document.getElementById('fedit-next')?.click(); }
    if (key === 'ArrowLeft') { document.getElementById('fedit-prev')?.click(); }
    if (key === ' ') { document.getElementById('fedit-space')?.click(); }
    if (/^[a-z0-9]+$/.test(key)) { document.getElementById('fedit-'+key)?.click(); }
  }

  useEffect(() => {
    setTextvalue(text);

    document.removeEventListener("keydown", onKeydown);
    document.addEventListener("keydown", onKeydown);
    return function cleanup() {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [text]);


  if (!open) return null;

  const layoutID = appStore.userSettings.editorLayout || 1;
  const layout = layouts.find(l => l.id === layoutID) || layouts[0];
  const clContainer = {
    'fedit': 1,
    ['fedit_l' + layoutID]: 1,
  };
  const clText = {
    'fedit__text': 1,
    'fedit__text_12': appStore.userSettings.editorFontSize == 1.25,
    'fedit__text_15': appStore.userSettings.editorFontSize == 1.5,
    'fedit__text_20': appStore.userSettings.editorFontSize == 2,
    'fedit__text_25': appStore.userSettings.editorFontSize == 2.5,
    'fedit__text_30': appStore.userSettings.editorFontSize == 3,
    'fedit__text_40': appStore.userSettings.editorFontSize == 4,
  };
  const clButton = (id: string) => ({
    'fedit__btn': 1,
    'fedit__btn_double': layout.doubleWidth.includes(id),
    'fedit__btn_triple': layout.tripleWidth.includes(id),
    'fedit__btn_empty': !id,
    'fedit__btn_top': layout.keysTop.includes(id),
  });
  const buttons = [
    { id: 'prev', comp: <div onClick={handlePrev} className={classNames(clButton('prev'))} id="fedit-prev" key="prev"><Icon name="keyboard_arrow_left" /></div> },
    { id: 'next', comp: <div onClick={handleNext} className={classNames(clButton('next'))} id="fedit-next" key="next"><Icon name="keyboard_arrow_right" /></div> },
    { id: 'erase', comp: <div onClick={handleErase} className={classNames(clButton('erase'))} id="fedit-erase" key="erase"><Icon name="backspace" /></div> },
    { id: 'reset', comp: <div onClick={handleReset} className={classNames(clButton('reset'))} key="reset"><Icon name="refresh" /></div> },
    { id: 'save', comp: <div onClick={handleSave} className={classNames(clButton('save'))} key="save"><Icon name="save" /></div> },
    { id: 'exit', comp: <div onClick={toggle} className={classNames(clButton('exit'))} key="exit"><Icon name="close" /></div> },
    { id: 'read', comp: <div onClick={handleRead} className={classNames(clButton('read'))} key="read"><Icon name="campaign" /></div> },
    { id: '123', comp: <div onClick={handleToggleView} className={classNames(clButton('toggleview'))} key="toggleview">123</div> },
    { id: 'settings', comp: <EditorSettings className={classNames(clButton('settings'))} key="settings"><Icon name="settings" /></EditorSettings> },
  ];
  const [textBeforeCursor, wordBeforeCursor, wordAfterCursor, textAfterCursor] = getTextAroundCursor(textvalue, cursor);


  return (
    <div className={classNames(clContainer)}>
      <div className={classNames(clText)} id="fedit__text">
        {textBeforeCursor}
        <span className="fedit__cursor-word">
          {wordBeforeCursor}
          <span className="fedit__cursor">|</span>
          {wordAfterCursor}
        </span>
        {' '}{textAfterCursor}
      </div>

      <div className="fedit__controls">
        {layout.keys.map((key: string, ii: number) => {
            if (['prev', 'next', 'save', 'reset', 'erase', 'exit', 'settings', 'read', '123'].includes(key)) {
              const btn = buttons.find(b => b.id === key);
              return btn?.comp;
            }
            if (!key) {
              return <div className={classNames(clButton(key))} key={ii}>-</div>
            }
            const char = allChars.find((ch: CharType) => ch.id === key) || { id: '', val: '', label: '' };
            return <div onClick={() => handleEnterChar(char.val)} className={classNames(clButton(char.id))} id={'fedit-' + char.id} key={ii}><span>{char.label}</span></div>
        })}
      </div>

      <div className="fedit__controls-top">
        {layout.keysTop.map((key: string, ii: number) => {
            const btn = buttons.find(b => b.id === key);
            return btn?.comp;
        })}
      </div>
    </div>
  );
});
