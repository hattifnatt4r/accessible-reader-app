import React from 'react';
import { NavBackButton, NavModal } from '../components/Nav';

export function AppNopage() {
  return (
    <div className="page-simple">
      <div className="page-simple__topbar">
        <div className="about-link">
          {' '}
        </div>
      </div>

      <div className="page-simple__left">
        <div className="page-simple__content">
          Page not found
        </div>

      </div>
      
      <div className="page-simple__controls">
        <NavBackButton />
        <NavModal />
      </div>
    </div>
  );
}
