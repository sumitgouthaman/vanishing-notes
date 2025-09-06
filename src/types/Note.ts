export interface Note {
  id: string;
  title: string;
  body: string;
  lastAccessed: number;
  created: number;
}

export interface AppSettings {
  deleteAfterDays: number;
}