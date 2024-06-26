import React from 'react';
import { PageSimple } from '../components/PageSimple';
import { observer } from 'mobx-react-lite';
import { FormFieldOptions } from '../components/FormButton';

export const UserSettings: React.FC = observer(() => {
  const appStore = window.app;
  const isLoggedIn = appStore.getIsLoggedIn();

  const form = appStore.userSettings;

  function setValue(name: string, value: string) {
    appStore.updateSettings({ [name]: value });
  }

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
    </PageSimple>
  );
});

