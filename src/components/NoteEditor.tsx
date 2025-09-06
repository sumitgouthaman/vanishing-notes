import React, { useState, useEffect } from 'react';
import { Save, X, Check, Trash2 } from 'lucide-react';
import { MDXEditor, headingsPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, InsertThematicBreak, BlockTypeSelect, CreateLink, InsertAdmonition, ListsToggle } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { Note } from '../types/Note';
import { confirmDeleteNote, formatLastAccessed } from '../utils/storage';

interface NoteEditorProps {
  note: Note;
  onSave: (updates: Partial<Note>) => void;
  onClose: () => void;
  onDelete: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onClose,
  onDelete,
}) => {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [normalizedBody, setNormalizedBody] = useState(note.body);
  const [initialNormalizedBody, setInitialNormalizedBody] = useState(note.body);
  const [isInitialNormalizationDone, setIsInitialNormalizationDone] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize normalizedBody when component mounts or note changes
  useEffect(() => {
    setNormalizedBody(note.body);
    setInitialNormalizedBody(note.body);
    setIsInitialNormalizationDone(false);
  }, [note.body]);

  useEffect(() => {
    // Only check for changes after initial normalization is complete
    if (!isInitialNormalizationDone) return;
    
    const titleChanged = title !== note.title;
    const bodyChanged = normalizedBody !== initialNormalizedBody;
    const hasChanges = titleChanged || bodyChanged;
    const isNewAndEmpty = !note.title && !note.body && !title && !normalizedBody;
    
    setHasUnsavedChanges(hasChanges && !isNewAndEmpty);
  }, [title, normalizedBody, note, initialNormalizedBody, isInitialNormalizationDone]);

  const handleSave = () => {
    onSave({ title, body });
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      if (!note.title && !note.body && !title && !normalizedBody) {
        onDelete();
      }
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  };

  const handleDelete = () => {
    if (confirmDeleteNote()) {
      onDelete();
    }
  };

  return (
    <div className="note-editor">
      <header className="editor-header">
        <div className="editor-title-section">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
          <div className="editor-timestamps">
            Last edited {formatLastAccessed(note.lastEdited)}
          </div>
        </div>
        <div className="editor-actions">
          <button onClick={handleDelete} className="delete-btn" title="Delete">
            <Trash2 size={18} />
          </button>
          <button onClick={handleSave} disabled={!hasUnsavedChanges} title="Save">
            <Save size={18} />
          </button>
          <button onClick={handleClose} title="Close">
            <X size={18} />
          </button>
          <button onClick={handleSaveAndClose} disabled={!hasUnsavedChanges} title="Save & Close">
            <Check size={18} />
          </button>
        </div>
      </header>

      <div className="editor-content">
        <MDXEditor
          markdown={body}
          onChange={(markdown) => {
            setBody(markdown);
            
            // On first onChange after mount, this is the initial normalization
            if (!isInitialNormalizationDone) {
              setNormalizedBody(markdown);
              setInitialNormalizedBody(markdown);
              setIsInitialNormalizationDone(true);
            } else {
              setNormalizedBody(markdown);
            }
          }}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            markdownShortcutPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <BlockTypeSelect />
                  <ListsToggle />
                  <InsertThematicBreak />
                </>
              )
            })
          ]}
        />
      </div>
    </div>
  );
};