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
  globalVolume: 0.25 | 0.5 | 0.75 | 1,
  filesNarrateSelection: 0 | 1,
  readerFontSize: number, // 1-2
  readerNarrateSelection: 0 | 1,
  editorFontSize: number, // 1-3
  editorNarrateSelection: 0 | 1,
  editorLayout: number,
};

export type ChatMessage = {
  date_add: string | null,
  message: string | null,
  from: string | null,
};