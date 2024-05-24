import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from './Modal';
import { AppLink } from './AppLink';
import { Icon } from './Icon';
import { PageButton } from './PageButton';
import './Nav.css';
import { useLocation, useNavigate } from 'react-router-dom';


export const NavModal = observer((props : { className?: string }) => {
  const { className = '' } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  const cl = {
    'page-button': 1,
    [className]: className,
  };
  
  return (
    <>
      <PageButton onClick={toggle} className={classNames(cl)}>
        <Icon name="menu" className="page-button__icon" />
      </PageButton>
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle} className="nav-modal">
        <ModalHeader toggle={toggle}>
          Menu
        </ModalHeader>
        <ModalBody>
          <AppLink to="/home" className="nav-link nav-link_colored">
            <img src="/images/icon_arrowback.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">Back</div>
          </AppLink>
          <AppLink to="/home" className="nav-link">
            <img src="/images/icon_home.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">Home</div>
          </AppLink>
          <br />
          <AppLink to="/files" className="nav-link">
            <img src="/images/icon_paper.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">Files</div>
          </AppLink>

          <AppLink to="/messages" className="nav-link">
            <img src="/images/icon_comment.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">Messages</div>
          </AppLink>

          <AppLink to="/about" className="nav-link">
            <img src="/images/icon_info.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">About</div>
          </AppLink>

          <AppLink to="/settings" className="nav-link">
            <img src="/images/icon_friend-request.png" alt="info" className="nav-link__icon"/>
            <div className="nav-link__text">Settings</div>
          </AppLink>

        </ModalBody>
      </Modal>
    </>
  );
});

export function NavBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  function back() {
    const path = location.pathname?.split('/');
    const newPath = path.length > 2 ? path.slice(0, -1).join('/') : '/'
    navigate(newPath);
  }
  return (
    <PageButton onClick={back}>
      <Icon name="arrow_back" className="page-button__icon" />
    </PageButton>
  );
}
