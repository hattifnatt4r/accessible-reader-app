import { makeObservable, observable, action } from "mobx";
import { UserInfoType, UserSettingsType } from "./consts/dataTypes";
import { post } from "./utils/query";

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
  @observable userInfo: UserInfoType | null = null;
  @observable userId: string = '';
  @observable token: string  = '';
  @observable isLoadingSession: boolean = true;
  
  constructor() {
    makeObservable(this);

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const s = JSON.parse(settings);
      if (s.filesNarrateSelection === undefined) s.filesNarrateSelection = 1;
      if (s.readerNarrateSelection === undefined) s.readerNarrateSelection = 1;
      this.userSettings = s;
    }

    this.loadUser();

  }

  loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) { 
      const res = await post('session', {}, { token: token || '' });
      if (res.token && res.value?.id) {
        this.setSession(token, res.value);
      }
    } else {
      this.setSession('', null);
    }
    this.isLoadingSession = false;
  }

  @action
  setSession = (token: string, userInfo: UserInfoType | null) => {
    this.token = token;
    this.userInfo = userInfo ?? null;
    this.userId = userInfo?.login_name || '';
    localStorage.setItem('token', token);
  }

  @action
  updateSettings = (newSettings : UserSettingsType) => {
    this.userSettings = { ...this.userSettings, ...newSettings };

    localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
  }

  getIsLoggedIn = () => {
    return !!this.userId;
  }
}