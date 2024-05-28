import React from 'react';
import { SvgIcon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { ModalLogin } from './ModalLogin';
import { Button } from '../components/Button';
import './Home.css';


export function Home() {
  return (
    <div className="home">
      <div className="page-simple__topbar">
        <div className="about-link">
          <a href="https://github.com/hattifnatt4r/accessible-reader-app" target="_blank" rel="noreferrer">
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
      
      <div className="home__flex">
        <div className="home__left">
          <div className="home__title">
            Welcome to EazyRead App!
          </div>
          <div className="home__descr">
            An app to help kids with visual and motor skills limitations to improve reading/writing abilities.
          </div>

          <ModalLogin>
            <Button className="home__login-btn">Log In</Button>
          </ModalLogin>
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
      
    </div>
  );
}
