import { FileIDType, ReaderFileType, ReaderTextType } from "../consts/dataTypes";
import { dataExampleFiles, dataExampleText } from "../consts/dataExamples";

export class ReaderFileStore {
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
}
