import { makeObservable, observable, action } from 'mobx';
import { FileIDType, ReaderFileType } from "../consts/dataTypes";
import { speakAll } from '../utils/narrate';
import { post } from '../utils/query';

export class FilesStore {
  @observable readerFiles: ReaderFileType[] = [];
  @observable selectedFileID: FileIDType = null;

  constructor() {
    makeObservable(this);

    this.loadFiles();
  }

  loadFiles = async() => {
    const res = await post('file_all', {});
    this.readerFiles = res.value || [];
    this.readerFiles.sort((a, b) => a?.filename > b?.filename ? 1 : (a?.filename < b?.filename ? -1 : 0))
    if (this.readerFiles.length) this.selectedFileID = this.readerFiles[0].id;

    const fileId = Number(localStorage.getItem('filesSelectedId'));
    if (this.readerFiles.find(f => f.id === fileId)) {
      this.selectedFileID = fileId;
    }

  }

  @action setFileID = (id : FileIDType) => {
    this.selectedFileID = id;
    const appStore = window.app;
    if (appStore.userSettings.filesNarrateSelection === '1') {
      speakAll([this.getFile(id)?.filename || '']);
    }
    localStorage.setItem('filesSelectedId', (id || '').toString());
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
