import classNames from 'classnames';
import { Icon } from '../components/Icon';
import { AppLink } from '../components/AppLink';
import { FileIDType } from '../consts/dataTypes';
import { ReaderFileType } from '../consts/dataTypes';

export function FilehomeFile(props : { file: ReaderFileType, className?: string, selected: boolean, setFileID: (id: FileIDType) => void }) {
  const { file, className, setFileID, selected, ...rest } = props;
  const cl = {
    'fhome-file': 1,
    'fhome-file_selected': selected,
    [className || '']: !!className,
  };

  function selectFile() {
    setFileID(file?.id || null);
  }
  
  return (
    <div className={classNames(cl)} onClick={selectFile}>
      <img src="/images/icon_file.png" alt="info" className="fhome-file__icon"/>
      
      <div className="fhome-file__name">
        {file?.name}
      </div>
      {/* <AppLink to={`/files/${file?.id}`}> Open </AppLink> */}
    </div>
  );
};
