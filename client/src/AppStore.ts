import { makeObservable, observable, action } from "mobx";
import { UserInfoType, UserSettingsType } from "./consts/dataTypes";
import { post } from "./utils/query";

const userInfoDefault: UserInfoType = { login_name: '', id: 1, email: '', fullname: '' };
const userSettingsDefault: UserSettingsType = {
  globalVolume: '100',
  globalNarrateRate: '100',
  filesNarrateSelection: '1',
  readerFontSize: '100',
  readerNarrateSelection: '1',
  editorFontSize: '125',
  editorNarrateSelection: '1',
  editorLayout: '2',
};

export class AppStore {
  @observable userSettings : UserSettingsType = userSettingsDefault;
  @observable userInfo: UserInfoType = userInfoDefault;
  @observable userId: string = '';
  @observable token: string  = '';
  @observable isLoadingSession: boolean = true;
  
  constructor() {
    makeObservable(this);

    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const s = JSON.parse(settings);
      this.userSettings = { ...userSettingsDefault, ...s };
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
    this.userInfo = userInfo ?? userInfoDefault;
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