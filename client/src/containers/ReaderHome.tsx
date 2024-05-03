import React, { useEffect, useState } from 'react';
import { ReaderHomeStore } from './ReaderHomeStore';
import { ReaderFileLink } from '../components/ReaderFileLink';

export function ReaderHome() {
  const [store, setStore] = useState<ReaderHomeStore | null>(null);

  useEffect(() => {
    const store = new ReaderHomeStore();
    setStore(store);
  }, []);

  console.log('selected:', store?.fileSelected);
  return (
    <div>
      <div>
        {store?.readerFiles.map(f => <ReaderFileLink file={f} setFileID={store.setFileID} key={f?.id} />)}
      </div>

      <div>
        Filename
        {store?.fileSelected}
      </div>

      <div>
        Buttons
      </div>
    </div>
  );
}
