import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { Masonry } from 'masonic';
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
  
  const MasonryNoteCard: React.FC<{
    index: number;
    data: Note;
    width: number;
  }> = ({ data: note, width }) => {
    const fadeLevel = calculateFadeLevel(note, settings);
    const yellowIntensity = 1 - fadeLevel;
    const backgroundColor = `rgb(${255}, ${241 + (255 - 241) * (1 - yellowIntensity)}, ${118 + (255 - 118) * (1 - yellowIntensity)})`;
    
    return (
      <div
        className="note-card"
        style={{ 
          width,
          opacity: 1 - fadeLevel * 0.7,
          backgroundColor: backgroundColor
        }}
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
        <div className="note-snippet" dangerouslySetInnerHTML={{ __html: getSnippet(note.body) }} />
        <div className="note-metadata">
          <span className="note-timestamps">
            {formatLastAccessed(note.lastAccessed)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>Vanishing Notes</h1>
        <div className="header-actions">
          <button className="settings-btn" onClick={onOpenSettings}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="notes-container">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          <Masonry
            items={notes}
            columnGutter={20}
            columnWidth={300}
            overscanBy={5}
            render={MasonryNoteCard}
          />
        )}
      </main>
      
      <button className="fab" onClick={onCreateNote}>
        <Plus size={24} />
      </button>
    </div>
  );
};