import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';
import './ModalLogin.css';

function handleRegister() {}
function handleLogin() {}

function getInputValid(v : string) {
  if (!v || v?.length < 5) return false;
  return true; 
}

export const ModalLogin = observer((props : { children: any }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ person_id: '', person_pw: '', error: '', message: '' });

  function toggle() {
    console.log('open:', open);
    setOpen(!open);
  }

  function handleChange(ev : any) {
    const name : 'person_id' | 'person_pw' = ev?.target?.name;
    if (!name) return;

    form[name] = ev.target?.value || '';
    form.error = '';
  }


  const disabled = !getInputValid(form.person_id) || !getInputValid(form.person_pw);
  
  return (
    <>
      <div onClick={toggle} className='modal-toggle'>
        {children}
      </div>
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle}>
        <ModalHeader>

        </ModalHeader>
        <ModalBody>
          Login
          <div>
            <input name="person_id" value={form.person_id} onChange={handleChange} className={'login-input ' + (!form.person_id ? 'input_empty' : '')} placeholder="Login name" required /><br/>
            <input name="person_pw" value={form.person_pw} onChange={handleChange} className={'login-input ' + (!form.person_pw ? 'input_empty' : '')} placeholder="Password" required type="password" />
            {form.error && <div className="login-error">{form.error}</div>}
            {form.message && <div className="login-message">{form.message}</div>}
            
            <br /><br />
            <div className={'login-button login-button_submit ' + (disabled ? 'login-button_disabled' : '')} onClick={handleLogin}>
              Log In
            </div>
            <div className={'login-button login-button_register ' + (disabled ? 'login-button_disabled' : '')} onClick={handleRegister}>
              Register
            </div>
          </div>

        </ModalBody>
      </Modal>
    </>
  );
});
