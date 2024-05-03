import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles } from "../consts/dataExamples";

export class ReaderHomeStore {
  readerFiles: ReaderFileType[] = [];
  fileSelected: FileIDType = null;

  constructor() {
    this.readerFiles = dataExampleFiles;
  }

  setFileID = (id : FileIDType) => {
    this.fileSelected = id;
  }

}
