import { useState } from 'react';
import classNames from 'classnames';
import { speakAll } from '../utils/narrate';
import { Icon } from './Icon';
import { Editor } from '../containers/Editor';
import './FormButton.css';


export function FormFieldOptions(props : { className?: string, title?: string, form: {[key:string]: string}, name: string, options: {v: string, l: string}[], onChange?: (name: string, val:string) => void }) {
  const { className, title, onChange = () => {}, options = [], name, form } = props;
  const formVal = form[name];
  const cl = {
    'form-group': 1,
    [className || '']: className,
  };
  const clButton = (val : string) => ({
    'form-button': 1,
    'form-button_selected': val === formVal,
  });

  function onClick(val: string, label?: string) {
    onChange(name, val);

    if (window.app.userSettings.globalNarrateButtonclick !== '0') {
      speakAll([label || val]);
    }
  }

  function onNarrateClick() {
    speakAll([title || '']);
  }

  return (
    <div className={classNames(cl)}>
      <div className="form-group__title">
        <div className="form-group__narrate" onClick={onNarrateClick}><Icon name="campaign" /></div>
        {title}
      </div>
      <div className="form-group__options">
        {options.map((opt, ii) => (
          <div className={classNames(clButton(opt.v))} onClick={() => onClick(opt.v, opt.l)} key={opt.v}>
            {opt.l}
          </div>
        ))}
      </div>
    </div>
  );
};


export function FormField(props: {
    className?: string,
    label: string,
    name: string,
    form: {[key:string]: string},
    onChange: (name: string, val:string) => void,
    editor?: boolean,
    maxLength?: number,
    textarea?: boolean,
    rows?: number,
    protect?: boolean }) {
  const { className = '', label, name, onChange, form, editor, maxLength, textarea, rows, protect } = props;

  const [editing, setEditing] = useState<boolean>(false);
  const [showpw, setShowpw] = useState<boolean>(false);


  function handleChange(ev : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = ev?.target;
    if (!name) return;
    onChange(name, value);
  }

  function toggleShowpw() {
    setShowpw(!showpw);
  }

  const cl = {
    'field': 1,
    'field_w-editor': editor,
    [className]: className,
  };

  return (
    <div className={classNames(cl)}>
      <div className="field-label">{label}</div>
      {!textarea && <input name={name} value={form[name]} onChange={handleChange} className="field-input" maxLength={maxLength} type={protect && !showpw ? 'password' : 'text'}/>}
      {textarea && <textarea name={name} value={form[name]} onChange={handleChange} className="field-input field-input_textarea" maxLength={maxLength} rows={rows} />}
      
      {protect && <div className="form-field__visibility" onClick={toggleShowpw}><Icon name={showpw ? 'visibility_off' : 'visibility'} /></div>}
      
      {editor && !textarea &&  <div onClick={() => setEditing(true)} className="field-input__editbtn"><Icon name="edit" /></div>}
      <br/>

      {editing && (
        <Editor
          open={!!editing}
          text={form[name]}
          toggle={() => setEditing(false)}
          save={(t) => { onChange(name, t); setEditing(false); }}
        />
      )}
    </div>
  );
}