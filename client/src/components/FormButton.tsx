import classNames from 'classnames';
import './FormButton.css';
import { speakAll } from '../utils/narrate';
import { Icon } from './Icon';


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