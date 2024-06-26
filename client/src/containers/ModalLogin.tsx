import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { post } from '../utils/query';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { FormField } from '../components/FormButton';
import './ModalLogin.css';


type LoginForm = { person_id: string, person_pw: string, email: string }

function validateRegister(form: LoginForm): string {
  if (!form.email) return 'Email is required';
  if (form.person_id.length < 4) return 'Username should be at least 4 characters long';
  if (form.person_pw.length < 6) return 'Password should be at least 6 characters long';
  return '';
}

function validateLogin(form: LoginForm): string {
  if (!form.person_id) return 'Username is required';
  if (!form.person_pw) return 'Password is required';
  return '';
}


export const ModalLogin = observer((props : { children: React.ReactNode }) => {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState<LoginForm>({ person_id: '', person_pw: '', email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
    setError('');
    setForm({ person_id: '', person_pw: '', email: '' });
  }

  function toggleMode(newMode: string) {
    setError('');
    setMode(newMode)
  }

  async function handleLogin() {
    const formError = validateLogin(form);
    if (formError) {
      setError(formError);
      return;
    }

    const res = await post('login', { name: form.person_id, pass: form.person_pw });
    if (res.value?.id && res?.token) {
      appStore.setSession(res.token, res.value)
      toggle();
    } else {
      setError(res.message);
    }
  }

  async function handleRegister() {
    const formError = validateRegister(form);
    if (formError) {
      setError(formError);
      return;
    }
  
    const res = await post('person_add', { name: form.person_id, pass: form.person_pw, email: form.email });
    if (res.value?.id) {
      setMessage('Success! You can now sign in.');
      setMode('signin');
      setError('');
    } else {
      setError(res.message);
    }
  }

  function onChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  const disabled = false;
  
  return (
    <>
      <div onClick={toggle} className='modal-toggle'>
        {children}
      </div>
      <Modal isOpen={open} toggle={toggle} className="modal-login">
        <ModalHeader toggle={toggle}>
        </ModalHeader>
        <ModalBody>
          <div className="login">
            <div className="login__title">
              <Icon name=""/>
              EazyReadApp.com
            </div>
            <div className="login__response note_message">{message}</div>
            <div className="login__response note_error">{error}</div>

            {mode === 'forgot' && (
              <>
                <div style={{ marginBottom: '2rem' }}>* In development</div>
                <span style={{ marginRight: '0.5rem' }}>Already have an account? </span>
                <Button linkButton onClick={() => toggleMode('signin')} className="login__mode-btn">Sign In</Button>
              </>
            )}
            {mode === 'signin' && (
              <form>
                <FormField label="Username" name="person_id" form={form} onChange={onChange} />
                <FormField label="Password" name="person_pw" form={form} onChange={onChange} protect />

                <Button disabled={disabled} onClick={handleLogin} className="login__login-btn">Sign In</Button><br/>
                <span style={{ marginRight: '0.5rem' }}>Don't have an account? </span>
                <Button linkButton onClick={() => toggleMode('signup')} className="login__mode-btn">Register</Button>

                <div style={{ marginTop: '1rem' }}>
                  <Button linkButton onClick={() => toggleMode('forgot')} className="login__mode-btn">Forgot password</Button>
                </div>
              </form>
            )}
            
            {mode === 'signup' && (
              <form>
                <FormField label="Username" name="person_id" form={form} onChange={onChange} />
                <FormField label="Email" name="email" form={form} onChange={onChange} />
                <FormField label="Password" name="person_pw" form={form} onChange={onChange} protect />

                <Button disabled={disabled} onClick={handleRegister} className="login__login-btn">Sign Up</Button><br/>
                <span style={{ marginRight: '0.5rem' }}>Already have an account? </span>
                <Button linkButton onClick={() => toggleMode('signin')} className="login__mode-btn">Sign In</Button>

                <div style={{ marginTop: '1rem' }}>
                  <Button linkButton onClick={() => toggleMode('forgot')} className="login__mode-btn">Forgot password</Button>
                </div>
              </form>
            )}
  
          </div>

        </ModalBody>
      </Modal>
    </>
  );
});
