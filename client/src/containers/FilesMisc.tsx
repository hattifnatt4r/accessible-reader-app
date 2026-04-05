import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { post, upload } from '../utils/query';
import { FileIDType, ReaderFileType } from '../consts/dataTypes';
import { Icon } from '../components/Icon';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { AppLink } from '../components/AppLink';
import { PageButton } from '../components/PageControls';
import { Button } from '../components/Button';
import { FormField } from '../components/FormButton';
import './FilesMisc.css';


export function FilesFile(props : { file: ReaderFileType, className?: string, selected: boolean, setFileID: (id: FileIDType) => void }) {
  const { file, className, setFileID, selected } = props;
  const cl = {
    'fhome-file': 1,
    'fhome-file_selected': selected,
    [className || '']: !!className,
  };

  function selectFile() {
    setFileID(file?.id || null);
  }

  const isSharedFile = file.person_id == 0;
  const currentUserId = window.app.userInfo.id;

  let displayName: React.ReactNode;
  if (file.is_chat) {
    const otherName = file.person_1 === currentUserId ? file.person_2_name : file.person_1_name;
    displayName = <><Icon name="chat" filled className="fhome-file__icon" /><div className="fhome-file__name">{otherName} <span className="fhome-file__title">- {file.title}</span></div></>;
  } else {
    displayName = <><Icon name={isSharedFile ? 'lock' : 'draft'} filled className="fhome-file__icon" /><div className="fhome-file__name">{file?.filename} <span className="fhome-file__title">- {file?.title}</span></div></>;
  }

  return (
    <div className={classNames(cl)} onClick={selectFile}>
      <div className="fhome-file__flex">
        {displayName}
      </div>
    </div>
  );
};


function validateFileInfo(file: { filename: string, title: string, filecontent: string }) {
  const { filename, title, filecontent } = file;
  if (!filename) return 'Filename is required';
  if (filename.length > 20) return 'Filename maximum length is 20'
  if (title.length > 100) return 'Title maximum length is 100'
  if (filecontent.length > 65535) return 'Content maximum length is 64KB'
  return '';
}

export const FilesEdit = observer((props : { file: ReaderFileType | null, onUpdated: () => void }) => {
  const { file, onUpdated } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ filename: "", title: "" });
  const appStore = window.app;
  const isSharedFile = file?.person_id === 0;

  useEffect(() => {
    setForm({ filename: file?.filename || '', title: file?.title || '' });
  }, [file])

  function toggle() {
    setOpen(!open);
    setError('');
    setMessage('');
  }

  const handleFileRename = async() => {
    const errors = validateFileInfo({ filename: form.filename, title: form.title, filecontent: '' });
    if (errors) {
      setError(errors);
      return;
    }
    const response = await post('file_upd', { id: file?.id, filename: form.filename, title: form.title });
    if (response.status === 'success') {
      setError('');
      setMessage("File updated: " + form.filename);
      onUpdated();
    } else {
      setError("Failed to update file");
      setMessage("");
    }
  }

  const handleFileDelete = async() => {
    const response = await post('file_del', { id: file?.id });
    if (response.status === 'success') {
      setError('');
      setMessage("File deleted: " + form.filename);
      onUpdated();
      toggle();
    } else {
      setError("Failed to delete file");
      setMessage("");
    }
  }

  function onChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="menu-dots" />

      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Rename / delete file #{file?.id}
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '1rem' }}>
            <div className="note_message">{message}</div>
            <div className="note_error">{error}</div>
          </div>

          {!appStore.userId && (
            <div><AppLink to="/home" className="button_link2">Sign In</AppLink> to edit files.</div>
          )}
          {appStore.userId && isSharedFile && <div>Cannot edit shared files.</div>}          

          {appStore.userId && !file && <div>File not selected.</div>}          

          {appStore.userId && file && !isSharedFile && (
            <>
              <form style={{ marginBottom: '3rem' }}>
                <FormField label="File Name" name="filename" form={form} onChange={onChange} maxLength={20} editor />
                <FormField label="Title" name="title" form={form} onChange={onChange} maxLength={100} editor />
                <Button onClick={handleFileRename}>Update</Button>
              </form>

              <div>
                <Button linkButton2 onClick={handleFileDelete}>Delete file</Button>
              </div>
            </>
          )}          

        </ModalBody>
      </Modal>
    </>
  );
});



export const FilesAdd = observer((props : { onUpdated: () => void, selectFile: (id: FileIDType) => void }) => {
  const { onUpdated, selectFile } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [form, setForm] = useState({ filename: 'New file', filecontent: '', title: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const appStore = window.app;

  function toggle() {
    setOpen(!open);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setError("");
      setMessage("");
    }
  };

  const handleFileCreate = async() => {
    const errors = validateFileInfo(form);
    if (errors) {
      setError(errors);
      return;
    }

    const response = await post('file_add', { filename: form.filename, title: form.title, content: form.filecontent });
    if (response.status === 'success' && response.value?.length) {
      setError('');
      setMessage("File created: " + form.filename);
      onUpdated();
      setForm({ filename: 'New file', filecontent: '', title: '' });
      toggle();
      selectFile(response.value[0]?.id);
    } else {
      setError("Failed to create file");
      setMessage("");
    }
  }

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('myFile', selectedFile);

    const response = await upload('file_upload', formData, form.filename);
    if (response.status === 'success') {
      setError('');
      setMessage("File created: " + form.filename);
      onUpdated();
      toggle();
    } else {
      setError("Failed to upload file");
      setMessage("");
    }
  };

  function onChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="plus" />

      <Modal isOpen={open} toggle={toggle} className="file-add-modal">
        <ModalHeader toggle={toggle}>
          Create new file
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '1rem' }}>
            <div className="note_message">{message}</div>
            <div className="note_error">{error}</div>
          </div>

          {!appStore.userId && (
            <div><AppLink to="/home" className="button_link2">Sign In</AppLink> to create new files.</div>
          )}

          {appStore.userId && (
            <>
              <form style={{ marginBottom: '7rem' }}>
                  <FormField label="File Name" name="filename" form={form} onChange={onChange} maxLength={20} editor />
                  <FormField label="Title" name="title" form={form} onChange={onChange} maxLength={100} editor />
                  <FormField label="Paste Text" name="filecontent" form={form} onChange={onChange} rows={10} maxLength={65535} textarea editor />
                  <Button onClick={handleFileCreate}>Create</Button>
              </form>

              <div>
                <div className="field-label">Or upload text file</div>
                <form onSubmit={handleFileUpload}>
                    <input type="file" name="myFile" onChange={handleFileChange} />
                    <button type="submit" className={selectedFile ? 'button' : 'button button_secondary'}>Upload</button>
                </form>
              </div>
            </>
          )}

        </ModalBody>
      </Modal>
    </>
  );
});


type ContactOption = { id: number; login: string; fullname: string };

export const ChatAdd = observer((props: { onUpdated: () => void, selectFile: (id: FileIDType) => void }) => {
  const { onUpdated, selectFile } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [personInput, setPersonInput] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<ContactOption | null>(null);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const appStore = window.app;
  const currentUserId = appStore.userInfo.id;

  const toggle = () => {
    setOpen(!open);
    setError('');
    setMessage('');
  };

  useEffect(() => {
    if (!open || !appStore.userId) return;
    post('contact_list', {}).then(res => {
      if (res.status !== 'success') return;
      const opts: ContactOption[] = (res.value || [])
        .filter((c: any) => c.status === 'accepted')
        .map((c: any) => c.person_1 === currentUserId
          ? { id: c.person_2, login: c.person_2_login, fullname: c.person_2_fullname }
          : { id: c.person_1, login: c.person_1_login, fullname: c.person_1_fullname }
        );
      setContacts(opts);
    });
  }, [open]);

  const suggestions = personInput.trim()
    ? contacts.filter(c =>
        c.login.toLowerCase().includes(personInput.toLowerCase()) ||
        c.fullname.toLowerCase().includes(personInput.toLowerCase())
      )
    : [];

  const handlePersonInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonInput(e.target.value);
    setSelectedPerson(null);
    setShowSuggestions(true);
  };

  const handleSelect = (c: ContactOption) => {
    setSelectedPerson(c);
    setPersonInput(c.fullname + ' (@' + c.login + ')');
    setShowSuggestions(false);
  };

  const handleCreate = async () => {
    if (!selectedPerson) {
      setError('Select a person from your contacts');
      return;
    }
    const fullTitle = title || '';
    const response = await post('file_add', { is_chat: true, title: fullTitle, person_1: currentUserId, person_2: selectedPerson.id });
    if (response.status === 'success' && response.value?.length) {
      setError('');
      onUpdated();
      setTitle('');
      setPersonInput('');
      setSelectedPerson(null);
      toggle();
      selectFile(response.value[0]?.id);
    } else {
      setError(response.error || 'Failed to create chat');
    }
  };

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="comment" />

      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          New chat
        </ModalHeader>
        <ModalBody>
          <div style={{ marginBottom: '1rem' }}>
            <div className="note_error">{error}</div>
          </div>

          {!appStore.userId && (
            <div><AppLink to="/home" className="button_link2">Sign In</AppLink> to create chats.</div>
          )}

          {appStore.userId && (
            <form style={{ marginBottom: '3rem' }}>
              <div className="field">
                <div className="field-label">Title</div>
                <input className="field-input" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
              </div>
              <div className="field" style={{ position: 'relative' }}>
                <div className="field-label">Invite person</div>
                <input
                  className="field-input"
                  value={personInput}
                  onChange={handlePersonInput}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  maxLength={100}
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'white', border: '1px solid #ddd', borderRadius: '0.4rem',
                    zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    {suggestions.map(c => (
                      <div
                        key={c.id}
                        onMouseDown={() => handleSelect(c)}
                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                      >
                        {c.fullname} <span style={{ color: '#888', fontSize: '0.85rem' }}>@{c.login}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleCreate} disabled={!selectedPerson}>Create</Button>
            </form>
          )}
        </ModalBody>
      </Modal>
    </>
  );
});
