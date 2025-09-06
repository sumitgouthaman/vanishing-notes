import React from 'react';
import { Note, AppSettings } from '../types/Note';
import { calculateFadeLevel, formatLastAccessed, getSnippet, confirmDeleteNote } from '../utils/storage';

interface HomeScreenProps {
  notes: Note[];
  settings: AppSettings;
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
  onOpenSettings: () => void;
  onDeleteNote: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  notes,
  settings,
  onCreateNote,
  onEditNote,
  onOpenSettings,
  onDeleteNote,
}) => {

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>Vanishing Notes</h1>
        <div className="header-actions">
          <button className="new-note-btn" onClick={onCreateNote}>
            + New Note
          </button>
          <button className="settings-btn" onClick={onOpenSettings}>
            ⚙️
          </button>
        </div>
      </header>

      <main className="notes-grid">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map((note) => {
            const fadeLevel = calculateFadeLevel(note, settings);
            return (
              <div
                key={note.id}
                className="note-card"
                style={{ opacity: 1 - fadeLevel * 0.7 }}
                onClick={() => onEditNote(note)}
              >
                <div className="note-card-header">
                  <h3 className="note-title">
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirmDeleteNote()) {
                        onDeleteNote(note.id);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                <p className="note-snippet">{getSnippet(note.body)}</p>
                <div className="note-metadata">
                  <span className="last-accessed">
                    {formatLastAccessed(note.lastAccessed)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};