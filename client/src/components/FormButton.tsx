import classNames from 'classnames';
import './FormButton.css';


/*
export function FormButton(props : { className?: string, form: {[key:string]: string}, name: string, val: string, label?: string, children?: React.ReactNode, onClick?: (name: string, val:string) => void }) {
  const { children, className, label, onClick = () => {}, val, name, form, ...rest } = props;
  const formVal = form[name];
  const selected = val === formVal;
  const cl = {
    'form-button': 1,
    'form-button_selected': selected,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)} onClick={() => onClick(name, val)} {...rest}>
      {label}
      {children}
    </div>
  );
};
*/

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

  return (
    <div className={classNames(cl)}>
      <div className="form-group__title">{title}</div>
      {options.map((opt, ii) => (
        <div className={classNames(clButton(opt.v))} onClick={() => onChange(name, opt.v)} key={opt.v}>
          {opt.l}
        </div>
      ))}
    </div>
  );
};