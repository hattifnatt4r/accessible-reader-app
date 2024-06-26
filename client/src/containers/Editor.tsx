import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon } from '../components/Icon';
import { EditorSettings } from './EditorSettings';
import { getTextAroundCursor } from './EditorUtils';
import './Editor.css';
import { speakAll } from '../utils/narrate';

type CharType = { id: string, val: string, label: string };
const simpleChars: string[] = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщьъыэюя.,1234567890+-=()*@":!?_'.split('');
let otherChars : CharType[] = [
  { id: 'space', val: ' ', label: ' ' },
  { id: 'more', val: ' ', label: '...' },
];
const allChars = [...otherChars, ...simpleChars.map(char => ({ id: char, val: char, label: char }))];

type LayoutType = { id: string, label: string, cols: number, rows: number, m1: string[], m2: string[], keysTop: string[], doubleWidth: string[], tripleWidth: string[] };

const layouts : LayoutType[] = [
  { id: '1',
    label: '1',
    cols: 9,
    rows: 5,
    m1: ['reset', '', 'save', '', ',', 'read', 'erase',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'p',
      'more', '', 'space', 'prev', 'next',
    ],
    m2: [
      'reset', '', 'save', '', '', 'read', 'erase',
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '@', '+', '=', '(', ')', '*', '_', '', '0',
      '', '.', ',', '!', '?', '"', ':', '-', '',
      'more', '', 'space', 'prev', 'next',
    ],
    keysTop: ['exit', 'settings'],
    doubleWidth: ['prev', 'next', 'read', 'erase'],
    tripleWidth: ['space'],
  },
  { id: '2',
    label: '2',
    cols: 9,
    rows: 4,
    m1: [//'reset'
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', 'p',
      'more', 'read', ',', 'space', 'prev', 'next',
    ],
    m2: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '@', '+', '=', '(', ')', '*', '_', '', '0',
      '', '.', ',', '!', '?', '"', ':', '-', '',
      'more', 'read', '', 'space', 'prev', 'next',
    ],
    keysTop: ['exit','settings', 'save', 'erase'],
    doubleWidth: ['prev', 'next', 'space'],
    tripleWidth: [],
  },
  { id: '3',
    label: '3',
    cols: 8,
    rows: 4,
    m1: [//'reset', ',', '.'
      'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', 'l',
      'more', 'q','p', 'space', 'read', 'prev', 'next',
    ],
    m2: [//'reset', ',', '.'
      '1', '2', '3', '4', '5', '6', '7', '8',
      '@', '+', '=', '(', ')', '*', '9', '0',
      '', '.', ',', '!', '?', '-', '"', ':',
      'more', '', '', 'space', 'read',  'prev', 'next',
    ],
    keysTop: ['exit','settings', 'save', 'erase'],
    doubleWidth: ['space'],
    tripleWidth: [],
  },

  { id: '4',
    label: '#4 Ru',
    cols: 9,
    rows: 5,
    m1: ['reset', 'й','ж', 'э', 'х', 'read', 'erase',
      'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з',
      'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю',
      'more', '.', 'space', 'prev', 'next',
    ],
    m2: [
      'reset', '', '', '', '', 'read', 'erase',
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '@', '+', '=', '(', ')', '*', '_', '', '0',
      '', '.', ',', '!', '?', '"', ':', '-', '',
      'more', '', 'space', 'prev', 'next',
    ],
    keysTop: ['exit', 'settings', 'save'],
    doubleWidth: ['prev', 'next', 'read', 'erase'],
    tripleWidth: ['space'],
  },
];


export const Editor = observer((props: { open: boolean, text: string, toggle: () => void, save: (textEdited: string) => void, readonly?: boolean }) => {
  const { open, text, toggle, save, readonly } = props;
  const [textvalue, setTextvalue] = useState<string>('');
  const [cursor, setCursor] = useState<number>(0);
  const [mode, setMode] = useState<string>('m1');
  const appStore = window.app;

  function narrateOnInput(char: string) {
    if (window.app.userSettings.editorNarrateInput === '1') {
      speakAll([char]);
    }
  }
  
  function handleNext() {
    if (cursor < textvalue.length) {
      setCursor(cursor + 1);
      narrateOnInput(textvalue[cursor]);
    }
  }
  function handlePrev() {
    if (cursor > 0) {
      setCursor(cursor - 1);

      narrateOnInput(textvalue[cursor - 1]);
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
    narrateOnInput(char);
  }

  function handleKeyboardChar(char: string) {
    const mapSomeKeys: {[key:string] : string} = { 'Enter': '\n' };
    char = mapSomeKeys[char] || char;
    setCursor((prevCursor) => {
      setTextvalue((prevTextvalue) => {
        const newTextvalue = prevTextvalue.substring(0, prevCursor) + char + prevTextvalue.substring(prevCursor);
        return newTextvalue;
      });
      return prevCursor + 1;
    });
    narrateOnInput(char);
  }
  function handleSave() {
    save(textvalue);
  }
  function handleReset() {
    setTextvalue(text);
    setCursor(0);
  }
  function handleRead() {
    speakAll([textvalue]);
  }
  function handleToggleMode() {
    if (mode === 'm1') { setMode('m2'); }
    else { setMode('m1'); }
  }

  function onKeydown(event: KeyboardEvent) {
    // support keyboard input
    const key = event.key;

    if (key === 'Backspace') { document.getElementById('fedit-erase')?.click(); }
    else if (key === 'ArrowRight') { document.getElementById('fedit-next')?.click(); }
    else if (key === 'ArrowLeft') { document.getElementById('fedit-prev')?.click(); }
    else if ([...simpleChars, ' ', 'enter'].includes(key.toLowerCase())) {
      handleKeyboardChar(key);
    }
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

  const layoutID = appStore.userSettings.editorLayout || '2';
  const layout : LayoutType = layouts.find(l => l.id === layoutID.toString()) || layouts[0];
  const modeIndex : 'm1' | 'm2' = mode === 'm1' ? 'm1' : 'm2';
  const clContainer = {
    'fedit': 1,
    ['fedit_l' + layoutID]: 1,
  };

  const fontSize = appStore.userSettings.editorFontSize || '100';
  const clText = {
    'fedit__text': 1,
    ['fedit__text_' + fontSize]: 1,
  };

  const clButton = (id: string, idFunc?: boolean) => ({
    'fedit__btn': 1,
    'fedit__btn_double': layout.doubleWidth.includes(id),
    'fedit__btn_triple': layout.tripleWidth.includes(id),
    'fedit__btn_empty': !id,
    'fedit__btn_top': layout.keysTop.includes(id),
    'fedit__btn_func': idFunc,
    'fedit__btn_colored': ['save', 'read'].includes(id),
    'fedit__btn_disabled': ['save'].includes(id) && readonly,
  });
  const buttons = [
    { id: 'prev', comp: <div onClick={handlePrev} className={classNames(clButton('prev', true))} id="fedit-prev" key="prev"><div className="fedit__btn-wrap"><Icon name="keyboard_arrow_left" /></div></div> },
    { id: 'next', comp: <div onClick={handleNext} className={classNames(clButton('next', true))} id="fedit-next" key="next"><div className="fedit__btn-wrap"><Icon name="keyboard_arrow_right" /></div></div> },
    { id: 'erase', comp: <div onClick={handleErase} className={classNames(clButton('erase', true))} id="fedit-erase" key="erase"><div className="fedit__btn-wrap"><Icon name="backspace" /></div></div> },
    { id: 'reset', comp: <div onClick={handleReset} className={classNames(clButton('reset', true))} key="reset"><div className="fedit__btn-wrap"><Icon name="refresh" /></div></div> },
    { id: 'save', comp: <div onClick={handleSave} className={classNames(clButton('save', true))} key="save"><div className="fedit__btn-wrap"><Icon name="save" /></div></div> },
    { id: 'exit', comp: <div onClick={toggle} className={classNames(clButton('exit', true))} key="exit"><div className="fedit__btn-wrap"><Icon name="close" /></div></div> },
    { id: 'read', comp: <div onClick={handleRead} className={classNames(clButton('read', true))} key="read"><div className="fedit__btn-wrap"><Icon name="campaign" /></div></div> },
    { id: 'more', comp: <div onClick={handleToggleMode} className={classNames(clButton('toggleview', true))} key="toggleview"><div className="fedit__btn-wrap">...</div></div> },
    { id: 'settings', comp: <EditorSettings className={classNames(clButton('settings', true))} key="settings"><div className="fedit__btn-wrap"><Icon name="settings" /></div></EditorSettings> },
  ];
  const [textBeforeCursor, wordBeforeCursor, wordAfterCursor, textAfterCursor] = getTextAroundCursor(textvalue, cursor);

  function getTextMultiline(text: string) {
    const lines = text.split('\n');
    return lines.map((t, i) => <span key={i}>{t}{i < lines.length-1 && <br />}</span>)
  }
  return (
    <div className={classNames(clContainer)}>
      <div className={classNames(clText)} id="fedit__text">
        {getTextMultiline(textBeforeCursor)}
        <span className="fedit__cursor-word">
          {getTextMultiline(wordBeforeCursor)}
          <span className="fedit__cursor">|</span>
          {getTextMultiline(wordAfterCursor)}
        </span>
        {' '}{getTextMultiline(textAfterCursor)}
      </div>

      <div className="fedit__controls">
        {layout[modeIndex].map((key: string, ii: number) => {
            if (['prev', 'next', 'save', 'reset', 'erase', 'exit', 'settings', 'read', 'more'].includes(key)) {
              const btn = buttons.find(b => b.id === key);
              return btn?.comp;
            }
            if (!key) {
              return <div className={classNames(clButton(key))} key={ii}>-</div>
            }
            const char = allChars.find((ch: CharType) => ch.id === key) || { id: '', val: '', label: '' };
            return (
              <div onClick={() => handleEnterChar(char.val)} className={classNames(clButton(char.id))} id={'fedit-' + char.id} key={ii}>
                <div className="fedit__btn-wrap">
                  <span>{char.label}</span>
                </div>
              </div>);
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

