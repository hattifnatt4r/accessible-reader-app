import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from './Modal';
import { AppLink } from './AppLink';
import { Icon, SvgIcon } from './Icon';
import { PageButton } from './PageButton';
import { useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';


export const NavModal = observer((props : { className?: string }) => {
  const { className = '' } = props;
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  const cl = {
    'page-button': 1,
    'page-button_thick': 1,
    [className]: className,
  };
  
  return (
    <>
      <PageButton
        onClick={toggle}
        className={classNames(cl)}
        iconSvgname="menu2"
        // iconName="menu"
      />
      <Modal toggleButton={'Nav'} isOpen={open} toggle={toggle} className="nav-modal">
        <ModalHeader toggle={toggle}>
          Menu
        </ModalHeader>
        <ModalBody>
          <AppLink to="/home" className="nav-link hover-move nav-link_colored">
            <SvgIcon iconName="arrowback" className="nav-link__svg"/>
            <div className="nav-link__text">Back</div>
          </AppLink>
          <AppLink to="/home" className="nav-link hover-move">
            <SvgIcon iconName="home" className="nav-link__svg"/>
            <div className="nav-link__text">Home</div>
          </AppLink>
          <br />
          <AppLink to="/files" className="nav-link hover-move">
            <SvgIcon iconName="paper" className="nav-link__svg"/>
            <div className="nav-link__text">Files</div>
          </AppLink>

          <AppLink to="/messages" className="nav-link hover-move">
            <SvgIcon iconName="comment" className="nav-link__svg"/>
            <div className="nav-link__text">Messages</div>
          </AppLink>

          <AppLink to="/about" className="nav-link hover-move">
            <SvgIcon iconName="info" className="nav-link__svg"/>
            <div className="nav-link__text">About</div>
          </AppLink>

          <AppLink to="/settings" className="nav-link hover-move">
            <SvgIcon iconName="person2" className="nav-link__svg"/>
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
    <PageButton
      onClick={back}
      iconSvgname="arrowback"
    />
  );
}
