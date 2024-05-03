import React from 'react';
import { Icon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { AppMenu } from '../containers/AppMenu'; 
import './Home.css';

export function Home() {
  return (
    <div className="home">
      <div className="home-top-text">
        Welcome to Accessible Reader-Editor App!
        <br />
        Short info.
      <br />
      </div>
      <div className="home-nav">
        Settings buttons
      </div>

      <div className="home-links">
        <AppLink to="/about" className="home-links__link"><Icon name="info" /> About</AppLink>
        <AppLink to="/reader" className="home-links__link"><Icon name="book" /> Reader</AppLink>
        <AppLink to="/chat" className="home-links__link"><Icon name="chat" /> Messages</AppLink>
      </div>

      <div className="home-footer">
        Footer
      </div>
    </div>
  );
}
