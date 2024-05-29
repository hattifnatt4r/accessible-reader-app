import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './containers/Home';
import { Files } from './containers/Files';
import { Fileview } from './containers/Fileview';
import { Messages } from './containers/Messages';
import { About } from './containers/About';
import { UserSettings } from './containers/UserSettings';
import { AppNopage } from './containers/AppNopage'; 
import { AppStore } from './AppStore';
import { apiConfig } from './config';
import { ApiConfigType } from './consts/dataTypes';
import './App.css';


declare global {
  interface Window {
    app: {[key:string] : any};
    apiConfig: ApiConfigType,
  }
}
window.apiConfig = apiConfig;
window.app = new AppStore();


export default function App() {
  return (
    <BrowserRouter>
      <div className="app" data-testid="app">
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="files" element={<Files />} />
          <Route path="files/:fileID" element={<Fileview />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<AppNopage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
