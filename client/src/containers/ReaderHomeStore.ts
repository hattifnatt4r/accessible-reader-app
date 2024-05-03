import { makeObservable, observable, action } from 'mobx';
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles } from "../consts/dataExamples";

export class ReaderHomeStore {
  readerFiles: ReaderFileType[] = [];
  @observable fileSelected: FileIDType = null;

  constructor() {
    makeObservable(this);
    this.readerFiles = dataExampleFiles;
  }

  @action setFileID = (id : FileIDType) => {
    this.fileSelected = id;
  }

}
