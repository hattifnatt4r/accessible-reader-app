import React from 'react';


export function FileviewButton(props: { iconName?: string | null, onClick?: () => void, children?: React.ReactNode | null }) {
  const { iconName, onClick, children } = props;

  return (
    <div className="page-button" onClick={onClick}>
      {children}
    </div>
  );
}
