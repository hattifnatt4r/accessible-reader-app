import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './Fileedit.css';



export const Fileedit = observer((props: { open: boolean, text: string, toggle: () => void }) => {
  const { open, text, toggle } = props;
  
  if (!open) return null;

  return (
    <div className="fileedit">
      <div onClick={toggle}>x</div>
      {text}
    </div>
  );
});
