import { makeObservable, observable, action } from 'mobx';
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { dataExampleFiles } from "../consts/dataExamples";
import { speakAll } from '../utils/narrate';

export class FilesStore {
  readerFiles: ReaderFileType[] = [];
  @observable selectedFileID: FileIDType = null;

  constructor() {
    makeObservable(this);
    this.readerFiles = dataExampleFiles;
    this.readerFiles.sort((a, b) => a?.name > b?.name ? 1 : (a?.name < b?.name ? -1 : 0))
    if (this.readerFiles.length) this.selectedFileID = this.readerFiles[0].id;
  }

  @action setFileID = (id : FileIDType) => {
    this.selectedFileID = id;
    const appStore = window.app;
    if (appStore.userSettings.filesNarrateSelection) {
      speakAll([this.getFile(id)?.name || '']);
    }
  }

  getFile = (id:FileIDType) => {
    const file = this.readerFiles.find(t => t?.id === id);
    return file || null;
  }

  nextPrevFile(diff: number) {
    const nfiles = this?.readerFiles?.length;
    const files = this?.readerFiles || [];
    if (!nfiles) {
      return;
    }
    if (!this.selectedFileID) {
      this.setFileID(this.readerFiles[0].id);
      return;
    }
    const index = files.findIndex(f => f.id === this.selectedFileID);
    if (diff === 1 && index < nfiles-1) {
      this.setFileID(files[index + 1].id);
    }
    if (diff === -1 && index > 0) {
      this.setFileID(files[index - 1].id);
    }
  }
}
