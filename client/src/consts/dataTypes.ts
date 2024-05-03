export type FileIDType = number | null;

export type ReaderFileType = {
  id: FileIDType,
  name: string | null,
  author: string | null,
} | null;

export type ReaderTextType = {
  id: FileIDType,
  text: string | null,
} | null;

export type UserProfile = {

};

export type UserSettings = {

};

export type ChatMessage = {
  date_add: string | null,
  message: string | null,
  from: string | null,
};