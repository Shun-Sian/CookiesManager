import React, { useState } from 'react';
import '../Styles/preference-section.css';

function PreferenceSection(props) {
  const [section, setSection] = useState(props.subsection);

  return (
    <div className="preference-section">
      <div className="input-group">
        <label htmlFor={`title-${props.subsection._id}`}>Title</label>
        <input
          id={`title-${props.subsection._id}`}
          type="text"
          value={section.title || ''}
          placeholder="Enter title"
          onChange={(e) => setSection((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="input-group">
        <label htmlFor={`content-${props.subsection._id}`}>Content</label>
        <input
          id={`content-${props.subsection._id}`}
          type="text"
          value={section.content || ''}
          placeholder="Enter content"
          onChange={(e) => setSection((prev) => ({ ...prev, content: e.target.value }))}
        />
      </div>
      <div className="button-group">
        <button className="update-button" onClick={() => props.onUpdate(section)}>
          {props.subsection._id ? 'Update' : 'Insert'}
        </button>
        {props.subsection._id && (
          <button className="remove-button" onClick={() => props.onDelete(section)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default PreferenceSection;
