import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { post } from '../utils/query';
import { Button } from '../components/Button';
import { FormField } from '../components/FormButton';
import { PageSimple } from '../components/PageSimple';

type Contact = {
  id: number;
  status: string;
  person_1: number;
  person_1_login: string;
  person_1_fullname: string;
  person_2: number;
  person_2_login: string;
  person_2_fullname: string;
};

export const Messages = observer(() => {
  const [form, setForm] = useState({ login_name: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const appStore = window.app;
  const currentUserId = appStore.userInfo.id;

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    const res = await post('contact_list', {});
    if (res.status === 'success') setContacts(res.value || []);
  };

  function onChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  const handleInvite = async () => {
    if (!form.login_name.trim()) {
      setError('Username is required');
      return;
    }
    const res = await post('contact_invite', { login_name: form.login_name.trim() });
    if (res.status === 'success') {
      setMessage('Invitation sent');
      setError('');
      setForm({ login_name: '' });
      loadContacts();
    } else {
      setError(res.error || 'Failed to send invitation');
      setMessage('');
    }
  };

  return (
    <PageSimple controls>
      <div className="page-simple__title">
        <div className="page-simple__title-text"><span>Messages</span></div>
      </div>

      <div className="page-simple__text">
        In development
        <br/>
        <br/>
        <br/>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Add contact</div>
          <div className="note_message">{message}</div>
          <div className="note_error">{error}</div>
          <form>
            <FormField label="Username" name="login_name" form={form} onChange={onChange} maxLength={20} />
            <Button onClick={handleInvite}>Send Invitation</Button>
          </form>
        </div>

        {contacts.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Contacts</div>
            {contacts.map(c => {
              const isOwn = c.person_1 === currentUserId;
              const other = isOwn
                ? { login: c.person_2_login, fullname: c.person_2_fullname }
                : { login: c.person_1_login, fullname: c.person_1_fullname };
              const label = isOwn ? 'invited' : 'invited you';
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 0', borderBottom: '1px solid #eee',
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: c.status === 'accepted' ? '#6abf69' : '#bbb',
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{other.fullname}</span>
                    {' '}
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>@{other.login}</span>
                  </div>
                  {c.status === 'accepted' && (
                    <div style={{ fontSize: '0.8rem', color: '#4caf50' }}>accepted</div>
                  )}
                  {c.status !== 'accepted' && !isOwn && (
                    <Button onClick={async () => {
                      const res = await post('contact_accept', { id: c.id });
                      if (res.status === 'success') loadContacts();
                    }}>Accept</Button>
                  )}
                  {c.status !== 'accepted' && isOwn && (
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>pending</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageSimple>
  );
});
