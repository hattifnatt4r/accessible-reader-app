import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { post, upload } from '../utils/query';
import { FileIDType, ReaderFileType } from '../consts/dataTypes';
import { Icon } from '../components/Icon';
import { Modal, ModalBody, ModalHeader } from '../components/Modal';
import { AppLink } from '../components/AppLink';
import { PageButton } from '../components/PageControls';
import { Button } from '../components/Button';
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
  
  return (
    <div className={classNames(cl)} onClick={selectFile}>
      <div className="fhome-file__flex">
        <Icon name={isSharedFile ? 'lock' : 'draft'} filled className="fhome-file__icon" />
        
        <div className="fhome-file__name">
          {file?.filename} <span className="fhome-file__title">- {file?.title}</span>
        </div>
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

  function handleChange(ev : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = ev?.target;
    if (!name) return;
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
              <div style={{ marginBottom: '3rem' }}>
                <div className="field-label">File Name</div>
                <input name="filename" value={form.filename} onChange={handleChange} className="field-input" maxLength={20} /><br/>
                <div className="field-label">Title</div>
                <input name="title" value={form.title} onChange={handleChange} className="field-input" maxLength={100} /><br/>
                <Button onClick={handleFileRename}>Update</Button>
              </div>

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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
    } else {
      setError("Failed to upload file");
      setMessage("");
    }
  };

  function handleChange(ev : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = ev?.target;
    if (!name) return;
    setForm({ ...form, [name]: value });
  }

  return (
    <>
      <PageButton onClick={toggle} iconSvgname="plus" />

      <Modal isOpen={open} toggle={toggle}>
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
              <div>
                <div className="field-label">File Name</div>
                <input name="filename" value={form.filename} onChange={handleChange} className="field-input" maxLength={20}/><br/>
                <div className="field-label">Title</div>
                <input name="title" value={form.title} onChange={handleChange} className="field-input" maxLength={100} /><br/>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <div className="field-label">Paste Text</div>
                <textarea name="filecontent" value={form.filecontent} onChange={handleChange} className="field-input" rows={10} maxLength={65535} /><br/>
                <Button onClick={handleFileCreate}>Create</Button>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <div className="field-label">Or upload text file</div>
                <form onSubmit={handleFileUpload}>
                    <input type="file" name="myFile" onChange={handleFileChange} />
                    <button type="submit">Upload</button>
                </form>
              </div>
            </>
          )}          

        </ModalBody>
      </Modal>
    </>
  );
});
