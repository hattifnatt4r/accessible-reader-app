type FormType = {[key:string] : any};

export function formChange(ev : React.ChangeEvent<HTMLInputElement>, form: FormType, setForm: (form: FormType) => void) {
  const { name, value } = ev?.target;
  if (!name) return;

  setForm({ ...form, [name]: value });
}