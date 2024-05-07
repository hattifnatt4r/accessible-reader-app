import React from 'react';
import { Icon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { AppMenu } from '../containers/AppMenu'; 
import './Home.css';
import { ModalLogin } from './ModalLogin';

export function Home() {
  return (
    <div className="home">
      <div className="home-body">
        <div className="home-top-text">
          Welcome to Accessible Reader-Editor App!
          <br />
          Short info.
        <br />
        </div>

        <div className="home-links">
          <AppLink to="/about" className="home-links__link"><Icon name="info" /> About</AppLink>
          <AppLink to="/reader" className="home-links__link"><Icon name="book" /> Reader</AppLink>
          <AppLink to="/chat" className="home-links__link"><Icon name="chat" /> Messages</AppLink>
          <AppLink to="/settings" className="home-links__link"><Icon name="settings" /> Settings</AppLink>
          
          <ModalLogin>
            Login
          </ModalLogin>
        </div>

      </div>
      

      <div className="home-footer">
        GitHub <br/>
        LinkedIn
      </div>
    </div>
  );
}
