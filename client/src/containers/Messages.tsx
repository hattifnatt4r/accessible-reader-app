import React from 'react';
import { NavBackButton, NavModal } from '../components/Nav';

export function Messages() {
  return (
    <div className="page-simple">
      <div className="page-simple__content">
        <div className="page-simple__title">Messages</div>
        <div className="page-simple__text">
          In development
        </div>
      </div>
      <div className="page-simple__controls">
        <NavBackButton />
        <NavModal />
      </div>
    </div>
  );
}
