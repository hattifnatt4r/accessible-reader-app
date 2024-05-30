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
  
  return (
    <div className={classNames(cl)} onClick={selectFile}>
      <div className="fhome-file__flex">
        <Icon name="draft" filled className="fhome-file__icon" />
        
        <div className="fhome-file__name">
          {file?.filename} - {file?.title}
        </div>
      </div>
    </div>
  );
};




export const FilesEdit = observer((props : { file: ReaderFileType | null, onUpdated: () => void }) => {
  const { file, onUpdated } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ filename: "", title: "" });
  const appStore = window.app;

  useEffect(() => {
    setForm({ filename: file?.filename || '', title: file?.title || '' });
  }, [file])

  function toggle() {
    setOpen(!open);
  }

  const handleFileRename = async() => {
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
          {appStore.userId && !file && <div>File not selected</div>}          


          {appStore.userId && file && (
            <>
              <div style={{ marginBottom: '3rem' }}>
                <div className="field-label">File Name</div>
                <input name="filename" value={form.filename} onChange={handleChange} className="field-input" /><br/>
                <div className="field-label">Title</div>
                <input name="title" value={form.title} onChange={handleChange} className="field-input" /><br/>
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



export const FilesAdd = observer((props : { onUpdated: () => void }) => {
  const { onUpdated } = props;
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
    const response = await post('file_add', { filename: form.filename, title: form.title, content: form.filecontent });
    if (response.status === 'success') {
      setError('');
      setMessage("File created: " + form.filename);
      onUpdated();
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
                <input name="filename" value={form.filename} onChange={handleChange} className="field-input" /><br/>
                <div className="field-label">Title</div>
                <input name="title" value={form.title} onChange={handleChange} className="field-input" /><br/>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <div className="field-label">Paste Text</div>
                <textarea name="filecontent" value={form.filecontent} onChange={handleChange} className="field-input" rows={10} /><br/>
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
