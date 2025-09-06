import React, { useState } from 'react';
import { X, Save, XCircle } from 'lucide-react';
import { AppSettings } from '../types/Note';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [deleteAfterDays, setDeleteAfterDays] = useState(settings.deleteAfterDays);

  const handleSave = () => {
    onSave({ deleteAfterDays });
    onClose();
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>Settings</h1>
        <button onClick={onClose} className="close-btn" title="Close">
          <X size={20} />
        </button>
      </header>

      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="deleteAfterDays">
            Delete unused notes after:
          </label>
          <div className="input-group">
            <input
              id="deleteAfterDays"
              type="number"
              min="1"
              max="365"
              value={deleteAfterDays}
              onChange={(e) => setDeleteAfterDays(Number(e.target.value))}
            />
            <span>days</span>
          </div>
          <p className="setting-description">
            Notes that haven't been accessed for this many days will automatically be deleted.
            Notes will gradually fade as they get closer to deletion.
          </p>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave} className="save-btn" title="Save Settings">
            <Save size={18} />
          </button>
          <button onClick={onClose} className="cancel-btn" title="Cancel">
            <XCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};