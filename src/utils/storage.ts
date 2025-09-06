import { Note, AppSettings } from '../types/Note';

const NOTES_KEY = 'vanishing-notes';
const SETTINGS_KEY = 'vanishing-notes-settings';

export const defaultSettings: AppSettings = {
  deleteAfterDays: 30,
};

export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const loadNotes = (): Note[] => {
  const stored = localStorage.getItem(NOTES_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;
  
  try {
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const getDaysToMilliseconds = (days: number): number => {
  return days * 24 * 60 * 60 * 1000;
};

export const cleanupExpiredNotes = (notes: Note[], settings: AppSettings): Note[] => {
  const now = Date.now();
  const maxAge = getDaysToMilliseconds(settings.deleteAfterDays);
  
  return notes.filter(note => (now - note.lastAccessed) < maxAge);
};

export const calculateFadeLevel = (note: Note, settings: AppSettings): number => {
  const now = Date.now();
  const maxAge = getDaysToMilliseconds(settings.deleteAfterDays);
  const age = now - note.lastAccessed;
  
  // Return fade percentage (0 = fully visible, 1 = almost transparent)
  return Math.min(age / maxAge, 0.8);
};

export const formatLastAccessed = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const getSnippet = (body: string, maxLength: number = 100): string => {
  return body.slice(0, maxLength).replace(/\n/g, ' ') + (body.length > maxLength ? '...' : '');
};

export const confirmDeleteNote = (): boolean => {
  return confirm('Are you sure you want to delete this note?');
};