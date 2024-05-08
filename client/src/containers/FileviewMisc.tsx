import React, { useEffect, useState } from 'react';
import { FileviewStore } from './FileviewStore';
import { useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';

export function FileviewButton(props: { iconName?: string | null, onClick?: () => void, children?: React.ReactNode | null }) {
  const { iconName, onClick, children } = props;

  return (
    <div className="fview-button">
      {children}
    </div>
  );
}
