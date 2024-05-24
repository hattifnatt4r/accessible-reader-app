import React from 'react';
import { NavBackButton, NavModal } from '../components/Nav';

export function Messages() {
  return (
    <div className="page-simple">
      <div className="page-simple__left">

        <div className="page-simple__content">
          <div className="page-simple__title">
            <div className="page-simple__title-text"><span>Messages</span></div>
          </div>
          <div className="page-simple__text">
            In development
          </div>
        </div>
      </div>
      <div className="page-simple__controls">
        <NavBackButton />
        <NavModal />
      </div>
    </div>
  );
}
