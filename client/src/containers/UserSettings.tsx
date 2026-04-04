import React, { useRef, useState } from 'react';
import { PageSimple } from '../components/PageSimple';
import { observer } from 'mobx-react-lite';
import { FormFieldOptions } from '../components/FormButton';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { post } from '../utils/query';
import { useParams } from 'react-router-dom';

export const UserSettings: React.FC = observer(() => {
  const { fileID } = useParams();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<{ file: File; url: string }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const appStore = window.app;
  const isLoggedIn = appStore.getIsLoggedIn();

  const form = appStore.userSettings;

  function setValue(name: string, value: string) {
    appStore.updateSettings({ [name]: value });
  }

  const handleImageUpdate = async (files: File[]) => {
    const apiUrl = (window as any).apiConfig?.apiUrl || '';
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      let data: any;
      try {
        const res = await fetch(apiUrl + 'image_upload', {
          method: 'POST', mode: 'cors', credentials: 'include', body: formData,
        });
        data = await res.json();
      } catch {
        throw new Error(`Failed to upload "${file.name}" — file may be too large`);
      }
      if (data.status !== 'success') {
        throw new Error(data.error || `Failed to upload "${file.name}"`);
      }
      await post('person_upd', { id: appStore.userId, image_url: URL.revokeObjectURL(imagePreviews[0].url) });
    }
    imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
    // loadData();
  };
  

  return (
    <PageSimple controls>
      <div className="page-simple__title">
        <div className="page-simple__title-text"><span>User Settings</span></div>
      </div>
      <div className="page-simple__text">
        {isLoggedIn && (
          <>
            User ID: {appStore.userInfo.id}
            <br/>
            User Name: {appStore.userId}
            <br/>
            Email: {appStore.userInfo.email}
            <br/>
            Image: <img src={appStore.userInfo.image_url}></img>
            <br/>
            <button className="button chatview__mic" onClick={() => imageInputRef.current?.click()}>
              <Icon name="image" />
            </button>

            <br/>
            In development
            <br/>
            <br/>
            <br/>
            <br/>
          </>
        )}
        {!isLoggedIn && (
          <>
            Not signed in.
          </>
        )}
        {isLoggedIn && (
          <>
            <FormFieldOptions
              form={form}
              name="globalNarrateButtonclick"
              title="Narrate on button click"
              onChange={setValue}
              options={[
                { v: '0', l: 'Off' },
                { v: '1', l: 'On' },
              ]}
            />
            <FormFieldOptions
              form={form}
              name="globalVolume"
              title="Sound Volume (global)"
              onChange={setValue}
              options={[
                { v: '25', l: '25%' },
                { v: '50', l: '50%' },
                { v: '75', l: '75%' },
                { v: '100', l: '100%' },
              ]}
            />
            <FormFieldOptions
              form={form}
              name="globalNarrateRate"
              title="Narrate Speed (global)"
              onChange={setValue}
              options={[
                { v: '50', l: '50%' },
                { v: '75', l: '75%' },
                { v: '100', l: '100%' },
              ]}
            />
          </>
        )}
      </div>

      <div>
        <Button linkButton onClick={() => { window.location.reload(); }}><Icon name="refresh" /> Reload page</Button>
      </div>
    </PageSimple>
  );
});

