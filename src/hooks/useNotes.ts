import { useState, useEffect } from 'react';
import { Note, AppSettings } from '../types/Note';
import { loadNotes, saveNotes, loadSettings, saveSettings, generateId, cleanupExpiredNotes } from '../utils/storage';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setAppSettings] = useState<AppSettings>(loadSettings());

  useEffect(() => {
    const loadedNotes = loadNotes();
    const cleanedNotes = cleanupExpiredNotes(loadedNotes, settings);
    setNotes(cleanedNotes);
    if (cleanedNotes.length !== loadedNotes.length) {
      saveNotes(cleanedNotes);
    }
  }, [settings]);

  const createNote = (): Note => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: '',
      body: '',
      lastAccessed: now,
      created: now,
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id'>>) => {
    const now = Date.now();
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, lastAccessed: now }
        : note
    );
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const accessNote = (id: string) => {
    updateNote(id, {});
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveSettings(newSettings);
  };

  const sortedNotes = [...notes].sort((a, b) => b.lastAccessed - a.lastAccessed);

  return {
    notes: sortedNotes,
    settings,
    createNote,
    updateNote,
    accessNote,
    deleteNote,
    updateSettings,
  };
};