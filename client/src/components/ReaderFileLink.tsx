import classNames from 'classnames';
import { ReactNode } from 'react';
import { AppLink } from './AppLink';
import { ReaderFileType } from '../consts/dataTypes';

export function ReaderFileLink(props : { file: ReaderFileType, className?: string, setFileID: any }) {
  const { file, className, setFileID, ...rest } = props;
  const cl = {
    'reader-file-link': 1,
    [className || '']: !!className,
  };
  
  return (
    <div className={classNames(cl)}>
      <div onClick={() => setFileID(file?.id)}>{file?.name}</div>
       <AppLink to={`/file/${file?.id}`}>
        Open
      </AppLink>
    </div>
  );
};