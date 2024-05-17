import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon } from '../components/Icon';
import { FileeditSettings } from './FileeditSettings';
import { getTextAroundCursor } from './FileeditUtils';
import './Fileedit.css';

type CharType = { id: string, val: string, label: string };
const simpleChars: string[] = ['a', 'b'];
let otherChars : CharType[] = [
  { id: 'space', val: ' ', label: ' ' },
];
const allChars = [...otherChars, ...simpleChars.map(char => ({ id: char, val: char, label: char }))];


export const Fileedit = observer((props: { open: boolean, text: string, toggle: () => void, save: (textEdited: string) => void }) => {
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


  useEffect(() => {
    setTextvalue(text);
  }, [text]);


  if (!open) return null;

  const cl = {
    'fedit': 1,
    'fedit-12': appStore.userSettings.editorFontSize == 1.25,
    'fedit-15': appStore.userSettings.editorFontSize == 1.5,
    'fedit-20': appStore.userSettings.editorFontSize == 2,
    'fedit-25': appStore.userSettings.editorFontSize == 2.5,
    'fedit-30': appStore.userSettings.editorFontSize == 3,
    'fedit-40': appStore.userSettings.editorFontSize == 4,
  };


  const [textBeforeCursor, wordBeforeCursor, wordAfterCursor, textAfterCursor] = getTextAroundCursor(textvalue, cursor);

  return (
    <div className={classNames(cl)}>
      <div className="fedit__text" id="fedit__text">
        {textBeforeCursor}
        <span className="fedit__cursor-word">
          {wordBeforeCursor}
          <span className="fedit__cursor">|</span>
          {wordAfterCursor}
        </span>
        {' '}{textAfterCursor}
      </div>
      
      <div className="fedit__controls">
        <div onClick={toggle} className="fedit__btn"><Icon name="close" /></div>
        <div onClick={handleSave} className="fedit__btn"><Icon name="save" /></div>
        <div onClick={handleReset} className="fedit__btn"><Icon name="refresh" /></div>
        <div onClick={handleErase} className="fedit__btn" id="fedit-erase"><Icon name="backspace" /></div>
        <div onClick={handlePrev} className="fedit__btn" id="fedit-prev"><Icon name="keyboard_arrow_left" /></div>
        <div onClick={handleNext} className="fedit__btn" id="fedit-next"><Icon name="keyboard_arrow_right" /></div>

        {allChars.map((char: CharType) => <div onClick={() => handleEnterChar(char.val)} className="fedit__btn" id={'fedit-' + char.id} key={'ch' + char.id}>{char.label}</div>)}

        <FileeditSettings>
          <div className="fedit__btn"><Icon name="settings" /></div>
        </FileeditSettings>
      </div>
    </div>
  );
});
