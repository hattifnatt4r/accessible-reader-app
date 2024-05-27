import { makeObservable, observable, action } from "mobx";
import { UserSettingsType } from "./consts/dataTypes";

export class AppStore {
  @observable userSettings : UserSettingsType = {
    globalVolume: '100',
    filesNarrateSelection: '1',
    readerFontSize: '100',
    readerNarrateSelection: '1',
    editorFontSize: '125',
    editorNarrateSelection: '1',
    editorLayout: '2',
  };
  @observable userID : number | null = null;

  constructor() {
    makeObservable(this);

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const s = JSON.parse(settings);
      if (s.filesNarrateSelection === undefined) s.filesNarrateSelection = 1;
      if (s.readerNarrateSelection === undefined) s.readerNarrateSelection = 1;
      this.userSettings = s;
    }

  }

  @action
  updateSettings = (newSettings : UserSettingsType) => {
    this.userSettings = { ...this.userSettings, ...newSettings };

    localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
  }
}