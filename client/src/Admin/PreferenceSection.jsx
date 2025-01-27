/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function PreferenceSection(props) {
  const [value, setValue] = useState(props.subsection);

  return (
    <div className="PreferencesSection">
      <div>
        <label htmlFor={`title-${props.subsection._id}`}>Add Title</label>
        <input
          id={`title-${props.subsection._id}`}
          type="text"
          value={value.title || ''}
          placeholder="Add Title"
          onChange={(e) => setValue((prev) => ({ ...prev, title: e.target.value }))}
          style={styles.subsectionInput}
        />
      </div>
      <div>
        <label htmlFor={`content-${props.subsection._id}`}>Add Content</label>
        <input
          id={`content-${props.subsection._id}`}
          type="text"
          value={value.content || ''}
          placeholder="Add Content"
          onChange={(e) => setValue((prev) => ({ ...prev, content: e.target.value }))}
          style={styles.subsectionInput}
        />
      </div>
      <button onClick={() => props.onUpdate(value)} style={styles.updateButton}>
        {props.subsection._id ? 'Update' : 'Insert'}
      </button>
      {props.subsection._id ? (
        <button onClick={() => props.onDelete(value)} style={styles.removeButton}>
          Remove
        </button>
      ) : (
        ''
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  subsectionsList: {
    listStyleType: 'none',
    padding: 0,
  },
  subsectionItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subsectionInput: {
    padding: '8px 16px',
    fontSize: '14px',
    width: '70%',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  removeButton: {
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  updateButton: {
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};

export default PreferenceSection;
