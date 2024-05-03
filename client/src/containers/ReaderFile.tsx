import React, { useEffect, useState } from 'react';
import { ReaderFileStore } from './ReaderFileStore';
import { useParams } from 'react-router-dom';

export function ReaderFile() {
  const [store, setStore] = useState<ReaderFileStore | null>(null);
  const { fileID } = useParams();

  useEffect(() => {
    const s = new ReaderFileStore({ id: Number(fileID) });
    setStore(s);
  }, []);

  return (
    <div>
      {store?.text?.text}
    </div>
  );
}
