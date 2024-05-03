import { makeObservable, observable, action } from 'mobx';
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles } from "../consts/dataExamples";

export class FilehomeStore {
  readerFiles: ReaderFileType[] = [];
  @observable fileSelected: FileIDType = null;

  constructor() {
    makeObservable(this);
    this.readerFiles = dataExampleFiles;
  }

  @action setFileID = (id : FileIDType) => {
    this.fileSelected = id;
  }

  getFile = (id:FileIDType) => {
    const file = this.readerFiles.find(t => t?.id === id);
    return file || null;
  }
}
