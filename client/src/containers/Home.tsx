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
          <div className="home-links__link">
            <AppLink to="/about"><Icon name="info" /> About</AppLink>
          </div>
          <div className="home-links__link">
            <AppLink to="/reader"><Icon name="book" /> Reader</AppLink>
          </div>
          <div className="home-links__link">
            <AppLink to="/chat"><Icon name="chat" /> Messages</AppLink>
          </div>
          <div className="home-links__link">
            <AppLink to="/settings"><Icon name="settings" /> Settings</AppLink>  
          </div>
          
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
