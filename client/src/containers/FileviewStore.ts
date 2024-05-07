import { FileIDType, ReaderFileType, ReaderTextType } from "../consts/dataTypes";
import { dataExampleFiles, dataExampleText } from "../consts/dataExamples";

export class FileviewStore {
  file: ReaderFileType = null;
  text: ReaderTextType = null;

  constructor(props : { id:FileIDType }) {
    const { id } = props;
    this.text = this.getFileText(id);
  }

  getFileText = (id:FileIDType) => {
    // todo: retrive from server
    const text = dataExampleText.find(t => t?.id === id);
    return text || null;
  }

  getFileTitle = (id:FileIDType) => {
    // todo: retrive from config
    const file = dataExampleFiles.find(t => t?.id === id);
    return file || null;
  }
}