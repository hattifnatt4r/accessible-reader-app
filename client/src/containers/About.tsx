import React from 'react';
import { PageSimple } from '../components/PageSimple';
import { getNarrateSupported } from '../utils/misc';

export function About() {
  return (
    <PageSimple controls>
      <div className="page-simple__title">
        <div className="page-simple__title-text"><span>About EazyReadApp</span></div>
      </div>
      <div className="page-simple__text">
        A small app to help people with vision and motor skills limitations improve their reading and writing skills. 
        Features:
        <ul>
          <li>upload text files,</li>
          <li>highlight and narrate text by word/sentence/paragraph,</li>
          <li>edit selected text with a special keyboard, </li>
          <li>change font size and keyboard design,</li>
          <li>create interactive taskbooks for learning, * in development</li>
          <li>send messages between registered users, * in development</li>
        </ul>
        
        The app has large easy-to-click buttons, adjustable font size.

        <br/>
        <br/>
        Narrate feature is available in browsers: Chrome
        <br/>
        Supported browsers: Chrome
        <br/>
        Supported devices: tablets and other touch devices with large screen


        <div style={{ marginTop: '2rem' }}>
          {!getNarrateSupported() && <div className="note_error">Narrate feature is not supported in your browser.</div>} 
        </div>
      </div>
    </PageSimple>
  );
}
