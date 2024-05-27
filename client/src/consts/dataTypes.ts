export type FileIDType = number | null;

export type ReaderFileType = {
  id: FileIDType,
  folder: string | '',
  name: string | '',
  title: string | '',
  author: string | '',
};

export type ReaderTextType = {
  id: FileIDType,
  text: string | null,
} | null;

export type UserProfile = {

};

export type UserSettingsType = {
  globalVolume: '25' | '50' | '75' | '100',
  filesNarrateSelection: '0' | '1',
  readerFontSize: string, // 100-300
  readerNarrateSelection: '0' | '1',
  editorFontSize: string, // 100-600
  editorNarrateSelection: '0' | '1',
  editorLayout: string,
};

export type ChatMessage = {
  date_add: string | null,
  message: string | null,
  from: string | null,
};