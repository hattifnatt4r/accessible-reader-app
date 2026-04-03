import React, { useState } from 'react';
import { Icon } from './Icon';
import './ImagePreview.css';

interface Props {
  previews: { file: File; url: string }[];
  onRemove: (index: number) => void;
  onCancel: () => void;
  onSend: (files: File[]) => Promise<void>;
}

export function ImagePreview({ previews, onRemove, onCancel, onSend }: Props) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    setIsSending(true);
    try {
      await onSend(previews.map(p => p.file));
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="img-preview__overlay">
      <div className="img-preview__modal">
        <div className="img-preview__grid">
          {previews.map((p, i) => (
            <div key={i} className="img-preview__item">
              <img src={p.url} alt="" className="img-preview__img" />
              <button className="img-preview__remove" onClick={() => onRemove(i)} disabled={isSending}>
                <Icon name="close" />
              </button>
            </div>
          ))}
        </div>
        {error && <div className="note_error">{error}</div>}
        <div className="img-preview__actions">
          <button className="button button_secondary" onClick={onCancel} disabled={isSending}>
            Cancel
          </button>
          <button className="button" onClick={handleSend} disabled={isSending}>
            {isSending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
