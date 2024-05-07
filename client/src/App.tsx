import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './containers/Home';
import { Login } from './containers/Login';
import { Filehome } from './containers/Filehome';
import { Fileview } from './containers/Fileview';
import { Editor } from './containers/Editor';
import { Chat } from './containers/Chat';
import { About } from './containers/About';
import { UserSettings } from './containers/UserSettings';
import { AppNopage } from './containers/AppNopage'; 
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="reader" element={<Filehome />} />
          <Route path="file/:fileID" element={<Fileview />} />
          <Route path="editor" element={<Editor />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<AppNopage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
