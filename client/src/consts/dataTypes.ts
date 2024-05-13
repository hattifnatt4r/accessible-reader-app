export type FileIDType = number | null;

export type ReaderFileType = {
  id: FileIDType,
  folder: string | null,
  name: string | null,
  title: string | null,
  author: string | null,
} | null;

export type ReaderTextType = {
  id: FileIDType,
  text: string | null,
} | null;

export type UserProfile = {

};

export type UserSettingsType = {
  readerFontSize: number,
};

export type ChatMessage = {
  date_add: string | null,
  message: string | null,
  from: string | null,
};