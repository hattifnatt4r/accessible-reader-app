import { makeObservable, observable, action } from "mobx";
import { UserSettingsType } from "./consts/dataTypes";

export class AppStore {
  @observable userSettings : UserSettingsType = { readerFontSize: 1, readerVolume: 1, readerNarrateSelection: 1, editorFontSize: 1, editorNarrateSelection: 1, editorLayout: 1 };

  constructor() {
    makeObservable(this);

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      this.userSettings = JSON.parse(settings);
    }
  }

  @action
  updateSettings = (newSettings : UserSettingsType) => {
    this.userSettings = { ...this.userSettings, ...newSettings };

    localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    console.log('upate:', newSettings);
  }
}