import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './containers/Home';
import { Login } from './containers/Login';
import { Filehome } from './containers/Filehome';
import { Fileview } from './containers/Fileview';
import { Messages } from './containers/Messages';
import { About } from './containers/About';
import { UserSettings } from './containers/UserSettings';
import { AppNopage } from './containers/AppNopage'; 
import { AppStore } from './AppStore';
import './App.css';

declare global {
  interface Window {
    app: {[key:string] : any};
  }
}
window.app = new AppStore();

export default function App() {
  return (
    <BrowserRouter>
      <div className="app" data-testid="app">
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="reader" element={<Filehome />} />
          <Route path="file/:fileID" element={<Fileview />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<AppNopage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
