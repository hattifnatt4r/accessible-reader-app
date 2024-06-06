import React from 'react';
import { PageSimple } from '../components/PageSimple';
import { observer } from 'mobx-react-lite';
import { AppLink } from '../components/AppLink';

export const UserSettings: React.FC = observer(() => {
  const appStore = window.app;
  const isLoggedIn = appStore.getIsLoggedIn();

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
          </>
        )}
        {!isLoggedIn && (
          <>
            Not signed in.
          </>
        )}
      </div>
    </PageSimple>
  );
});

