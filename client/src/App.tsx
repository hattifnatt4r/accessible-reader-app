import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './containers/Home';
import { Login } from './containers/Login';
import { ReaderHome } from './containers/ReaderHome';
import { ReaderFile } from './containers/ReaderFile';
import { Editor } from './containers/Editor';
import { Chat } from './containers/Chat';
import { About } from './containers/About';
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
          <Route path="reader" element={<ReaderHome />} />
          <Route path="file/:fileID" element={<ReaderFile />} />
          <Route path="editor" element={<Editor />} />
          <Route path="chat" element={<Chat />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<AppNopage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
