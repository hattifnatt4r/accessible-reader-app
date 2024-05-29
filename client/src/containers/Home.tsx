import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { Button } from '../components/Button';
import { PageSimple } from '../components/PageSimple';
import { ModalLogin } from './ModalLogin';
import './Home.css';


export const Home: React.FC = observer(() =>  {
  const navigate = useNavigate();

  const appStore = window.app;
  const isLoggedIn = appStore.getIsLoggedIn();

  function handleNavFiles() {
    navigate('/files');
  }

  return (
    <PageSimple>
      
      <div className="home__flex">
        <div className="home__left">
          <div className="home__title">
            Welcome to EazyRead App!
          </div>
          <div className="home__descr">
            An app to help kids with visual and motor skills limitations to improve reading/writing abilities.
          </div>

          {!isLoggedIn && !appStore.isLoadingSession && (
            <ModalLogin>
              <Button className="home__btn-login">Sign In</Button>
            </ModalLogin>
          )}
          {isLoggedIn && (
            <div>
              <Button className="home__btn-view" onClick={handleNavFiles}>Go to Files</Button>
            </div>
          )}
        </div>

        <div className="home__right">
          <img src="/images/home_polygon_11.svg" className="home__polygon" alt="polygon" />
          <div className="home__links">
            <AppLink to="/files" className="home-links__link hover-move home-links__link_colored">
              <SvgIcon iconName="paper" className="home-links__svg"/>
              <div className="home-link__text">Files</div>
            </AppLink>

            <AppLink to="/about" className="home-links__link hover-move">
              <SvgIcon iconName="info" className="home-links__svg"/>
              <div className="home-link__text">About</div>
            </AppLink>

            <AppLink to="/messages" className="home-links__link hover-move">
              <SvgIcon iconName="comment" className="home-links__svg"/>
              <div className="home-link__text">Messages</div>
            </AppLink>

            <AppLink to="/settings" className="home-links__link hover-move">
              <SvgIcon iconName="person2" className="home-links__svg"/>
              <div className="home-link__text">Settings</div>
            </AppLink>

          </div>
        </div>
      </div>
      
    </PageSimple>
  );
});
