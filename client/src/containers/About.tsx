import React from 'react';
import { PageSimple } from '../components/PageSimple';
import { getBrowserName, getNarrateSupported } from '../utils/misc';

export function About() {
  return (
    <PageSimple controls>
      <div className="page-simple__title">
        <div className="page-simple__title-text"><span>About EazyReadApp</span></div>
      </div>
      <div className="page-simple__text">
        A small web app for <b>tablets</b> to help people with with vision and motor skills limitations improve their reading and writing skills. 
        Features:
        <ul>
          <li>upload text files,</li>
          <li>highlight and narrate text by word/sentence/paragraph,</li>
          <li>edit selected text with special keyboard, </li>
          <li>change font size and keyboard design,</li>
          <li>send messages between registered app users, * in development</li>
          <li>create interactive notebooks for learning, * in development</li>
        </ul>
        
        The app has large easy-to-click buttons, and large adjustable font size.

        <br/>
        <br/>
        Narrate feature is available in browsers: Chrome
        <br/>
        Supported browsers: Chrome

        <div style={{ marginTop: '2rem' }}>
          {!getNarrateSupported() && <div className="note_error">Narrate feature is not supported in your browser.</div>} 
        </div>
      </div>
    </PageSimple>
  );
}
