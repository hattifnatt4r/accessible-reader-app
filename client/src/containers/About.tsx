import React from 'react';
import { PageSimple } from '../components/PageSimple';

export function About() {
  return (
    <PageSimple controls>
      <div className="page-simple__title">
        <div className="page-simple__title-text"><span>About</span></div>
      </div>
      <div className="page-simple__text">
        EazyReadApp is a small web app I made for my friend to help improve reading/writing skills - the app is tailored for people with vision and motor skills limitations. 
        Features:
        <ul>
          <li>upload text files</li>
          <li>highlight and narrate text by word/sentence/paragraph</li>
          <li>edit selected text with special keyboard </li>
          <li>change font size and keyboard design</li>
          <li>send messages between registered app users (* in development)</li>
          <li>create interactive notebooks for learning (* in development)</li>
        </ul>
        
        The app has large easy-to-click buttons, and large adjustable font size.
      </div>
    </PageSimple>
  );
}
