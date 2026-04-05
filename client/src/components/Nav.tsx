import React, { useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Modal, ModalBody, ModalHeader } from './Modal';
import { AppLink } from './AppLink';
import { SvgIcon } from './Icon';
import { PageButton } from './PageControls';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserInfoType } from '../consts/dataTypes';
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
      />
      <Modal isOpen={open} toggle={toggle} className="nav-modal">
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

export function NavChatPerson({ person, title } : { person: UserInfoType | null, title?: string }) {
  const [open, setOpen] = useState(false);

  const image = person?.image_url;
  return (
    <>
      <PageButton
        onClick={() => setOpen(!open)}
        iconSvgname={!image ? "person2" : ''}
      >
        {image && <img src={image} className="navbutton_person"/>}
      </PageButton>
      <Modal isOpen={open} toggle={() => setOpen(false)} className="nav-chat-person-modal">
        <ModalHeader toggle={() => setOpen(false)}>{title || ''}</ModalHeader>
        <ModalBody>
          {image && <img src={image} className="nav-chat-person-modal__img" />}
          {!image && <div className="nav-chat-person-modal__no-img"><SvgIcon iconName="person2" /></div>}
          <div className="nav-chat-person-modal__name">{person?.fullname || person?.login_name || ''}</div>
        </ModalBody>
      </Modal>
    </>
  );
}
