import classNames from 'classnames';
import { ReactNode } from 'react';
import { AppLink } from '../components/AppLink';
import { ReaderFileType } from '../consts/dataTypes';

export function FilehomeFile(props : { file: ReaderFileType, className?: string, setFileID: any }) {
  const { file, className, setFileID, ...rest } = props;
  const cl = {
    'filehome-link': 1,
    [className || '']: !!className,
  };
  
  return (
    <div className={classNames(cl)}>
      <div onClick={() => setFileID(file?.id)} className="filehome-link__name">
        {file?.name}
      </div>
       <AppLink to={`/file/${file?.id}`}>
        Open
      </AppLink>
    </div>
  );
};