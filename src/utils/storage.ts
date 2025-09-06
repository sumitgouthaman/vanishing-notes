import { Note, AppSettings } from '../types/Note';
import { marked } from 'marked';

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

export const getSnippet = (body: string, maxLines: number = 3): string => {
  if (!body.trim()) return '';
  
  try {
    // Convert markdown to HTML
    const html = marked.parse(body);
    
    // Keep basic formatting tags but remove others
    const formattedText = html
      // Remove dangerous/unwanted tags but keep formatting
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      // Remove block-level container tags but keep their content
      .replace(/<\/?div[^>]*>/gi, '')
      .replace(/<\/?section[^>]*>/gi, '')
      .replace(/<\/?article[^>]*>/gi, '')
      // Keep basic formatting: headings, strong, em, lists, code
      // Remove paragraph tags since we handle line breaks differently
      .replace(/<\/?p[^>]*>/gi, '\n')
      // Convert br tags to newlines
      .replace(/<br[^>]*>/gi, '\n')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Decode HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    
    // Split by actual line breaks and filter empty lines
    const lines = formattedText.split('\n').filter(line => line.trim());
    const previewLines = lines.slice(0, maxLines);
    
    // If we truncated, add ellipsis
    const hasMore = lines.length > maxLines;
    const result = previewLines.join('\n');
    
    return result + (hasMore ? '...' : '');
  } catch (error) {
    // Fallback to simple truncation if marked fails
    const lines = body.split('\n').slice(0, maxLines);
    return lines.join('\n') + (body.split('\n').length > maxLines ? '...' : '');
  }
};

export const confirmDeleteNote = (): boolean => {
  return confirm('Are you sure you want to delete this note?');
};