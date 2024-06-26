export type ApiResponseType = {
  status?: string | '',
  message?: string | '',
  value?: any[],
};

export type FileIDType = number | null;

export type ReaderFileType = {
  id: FileIDType,
  folder: string | '',
  filename: string | '',
  title: string | '',
  person_id: number | null,
  author_id: number | null,
  filetype: string,
  config: string,
};

export type ReaderParagraphType = {
  content: string,
  type: string | '',
  id: number,
  // className: string,
}

export type ReaderContentItemType = {
  type: string | '',
  content: string | '',
  answer?: string | '',
};

export type ReaderTextType = {
  id: FileIDType,
  content: string | null,
} | null;

export type UserProfile = {

};

export type UserSettingsType = {
  globalVolume: '25' | '50' | '75' | '100',
  globalNarrateRate: string, // 0-100 %
  globalNarrateButtonclick: '0' | '1',
  filesNarrateSelection: '0' | '1',
  readerFontSize: string, // 100-300
  readerNarrateSelection: '0' | '1',
  editorFontSize: string, // 100-600
  editorNarrateSelection: '0' | '1',
  editorNarrateInput: '0' | '1',
  editorLayout: string,
};

export type ChatMessage = {
  date_add: string | null,
  message: string | null,
  from: string | null,
};

export type ApiConfigType = {
  apiUrl: string;
};

export type UserInfoType = {
  login_name: string,
  id: number,
  email: string,
  fullname: string,
}