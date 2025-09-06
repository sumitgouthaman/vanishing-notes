import React, { useState } from 'react';
import { useNotes } from './hooks/useNotes';
import { HomeScreen } from './components/HomeScreen';
import { NoteEditor } from './components/NoteEditor';
import { Settings } from './components/Settings';
import { Note } from './types/Note';
import './App.css';

type View = 'home' | 'editor' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const notesHook = useNotes();

  const handleCreateNote = () => {
    const newNote = notesHook.createNote();
    setCurrentNoteId(newNote.id);
    setCurrentView('editor');
  };

  const handleEditNote = (note: Note) => {
    notesHook.accessNote(note.id);
    setCurrentNoteId(note.id);
    setCurrentView('editor');
  };

  const handleCloseEditor = () => {
    setCurrentNoteId(null);
    setCurrentView('home');
  };

  const handleOpenSettings = () => {
    setCurrentView('settings');
  };

  const handleCloseSettings = () => {
    setCurrentView('home');
  };

  const currentNote = currentNoteId 
    ? notesHook.notes.find(note => note.id === currentNoteId)
    : null;

  return (
    <div className="app">
      {currentView === 'home' && (
        <HomeScreen
          notes={notesHook.notes}
          settings={notesHook.settings}
          onCreateNote={handleCreateNote}
          onEditNote={handleEditNote}
          onOpenSettings={handleOpenSettings}
          onDeleteNote={notesHook.deleteNote}
        />
      )}
      {currentView === 'editor' && currentNote && (
        <NoteEditor
          note={currentNote}
          onSave={(updates) => notesHook.updateNote(currentNote.id, updates)}
          onClose={handleCloseEditor}
          onDelete={() => {
            notesHook.deleteNote(currentNote.id);
            handleCloseEditor();
          }}
        />
      )}
      {currentView === 'settings' && (
        <Settings
          settings={notesHook.settings}
          onSave={notesHook.updateSettings}
          onClose={handleCloseSettings}
        />
      )}
    </div>
  );
};

export default App;