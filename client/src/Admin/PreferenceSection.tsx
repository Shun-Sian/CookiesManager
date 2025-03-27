import React, { useState, useEffect } from 'react';
import type { PreferenceSectionProps } from '../types/PreferenceSection.types';
import '../Styles/preference-section.css';

export default function PreferenceSection(props: PreferenceSectionProps) {
  const { subsection, onUpdate, onDelete } = props;
  const [section, setSection] = useState(subsection);

  useEffect(() => {
    setSection(subsection);
  }, [subsection]);

  return (
    <div className="preference-section">
      <div className="input-group">
        <label htmlFor={`title-${subsection._id}`}>Title</label>
        <input
          id={`title-${subsection._id}`}
          type="text"
          value={section.title || ''}
          placeholder="Enter title"
          onChange={(e) => setSection((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="input-group">
        <label htmlFor={`content-${subsection._id}`}>Content</label>
        <textarea
          id={`content-${subsection._id}`}
          value={section.content || ''}
          placeholder="Enter content"
          onChange={(e) => setSection((prev) => ({ ...prev, content: e.target.value }))}
          rows={4}
        />
      </div>
      <div className="button-group">
        <button className="update-button" onClick={() => onUpdate(section)}>
          {subsection._id ? 'Update' : 'Insert'}
        </button>
        {subsection._id && (
          <button className="remove-button" onClick={() => onDelete(section)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
