import React from 'react';
import { Icon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { AppMenu } from '../containers/AppMenu'; 
import { ModalLogin } from './ModalLogin';
import { Button } from '../components/Button';
import './Home.css';


export function Home() {
  return (
    <div className="home">
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
          <img src="/images/home_polygon_03.svg" className="home__polygon" />
          <div className="home__links">
            <AppLink to="/files" className="home-links__link home-links__link_colored">
              <img src="/images/icon_paper.png" alt="info" className="home-link__icon"/>
              <div className="home-link__text">Files</div>
            </AppLink>

            <AppLink to="/about" className="home-links__link">
              <img src="/images/icon_info.png" alt="info" className="home-link__icon"/>
              <div className="home-link__text">About</div>
            </AppLink>

            <AppLink to="/messages" className="home-links__link">
              <img src="/images/icon_comment.png" alt="info" className="home-link__icon"/>
              <div className="home-link__text">Messages</div>
            </AppLink>

            <AppLink to="/settings" className="home-links__link">
              <img src="/images/icon_friend-request.png" alt="info" className="home-link__icon"/>
              <div className="home-link__text">Settings</div>
            </AppLink>

          </div>
        </div>
      </div>
      

      <div className="home__footer">
        <div className="home__footer-link">
          <a href="https://github.com/hattifnatt4r/accessible-reader-app" target="_blank">
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
