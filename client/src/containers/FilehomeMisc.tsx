import classNames from 'classnames';
import { ReactNode } from 'react';
import { AppLink } from '../components/AppLink';
import { ReaderFileType } from '../consts/dataTypes';
import { Icon } from '../components/Icon';

export function FilehomeFile(props : { file: ReaderFileType, className?: string, setFileID: any }) {
  const { file, className, setFileID, ...rest } = props;
  const cl = {
    'fhome-file': 1,
    [className || '']: !!className,
  };
  
  return (
    <div className={classNames(cl)}>
      <div onClick={() => setFileID(file?.id)} className="fhome-file__name">
        {file?.name}
      </div>
       <AppLink to={`/file/${file?.id}`}>
        Open
      </AppLink>
    </div>
  );
};

export function FilehomeButton(props: { iconName?: string | null, onClick?: any | null, children?: any | null }) {
  const { iconName, onClick, children } = props;

  return (
    <div className="fview-button">
      <Icon name={iconName || null}/>
      {children}
    </div>
  );
}