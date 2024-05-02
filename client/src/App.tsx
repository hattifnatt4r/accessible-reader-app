import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './containers/Home';
import { Login } from './containers/Login';
import { Reader } from './containers/Reader';
import { Editor } from './containers/Editor';
import { Chat } from './containers/Chat';
import { AppNopage } from './containers/AppNopage'; 
import { AppHeader } from './containers/AppHeader'; 
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppHeader />
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="reader" element={<Reader />} />
          <Route path="editor" element={<Editor />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<AppNopage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
