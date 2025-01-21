/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [subsections, setSubsections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSubsections = JSON.parse(localStorage.getItem('subsections'));
    if (storedSubsections) {
      setSubsections(storedSubsections);
    }
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      const allPreferences = await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
      setSubsections(allPreferences);
      console.log(allPreferences);
    };
    fetchPreferences();
  }, []);

  const handleAddSubsection = () => {
    const newSubsection = {
      id: Date.now(),
      title: 'Add Title',
      content: 'Add Content'
    };
    const updatedSubsections = [...subsections, newSubsection];
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  const handleRemoveSubsection = (id) => {
    const updatedSubsections = subsections.filter((sub) => sub.id !== id);
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  const handleEditSubsection = (id, field, value) => {
    const updatedSubsections = subsections.map((sub) => {
      if (sub.id === id) {
        return {
          ...sub,
          [field]: value,
        };
      }
      return sub;
    });
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  return (
    <div style={styles.container}>
      <h2>Admin Panel</h2>
      <h3>Manage Subsections</h3>
      <button onClick={handleAddSubsection} style={styles.addButton}>
        Add Subsection
      </button>
      <ul style={styles.subsectionsList}>
        {subsections.map((subsection) => (
          <li key={subsection.id} style={styles.subsectionItem}>
          <input
            type="text"
            value={subsection.title}
            onChange={(e) => handleEditSubsection(subsection.id, 'title', e.target.value)} 
            style={styles.subsectionInput}
          />
          <input
            type="text"
            value={subsection.content}
            onChange={(e) => handleEditSubsection(subsection.id, 'content', e.target.value)} 
            style={styles.subsectionInput}
          />
          <button style={styles.updateButton}>
            Update
          </button>
          <button onClick={() => handleRemoveSubsection(subsection.id)} style={styles.removeButton}>
            Remove
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
};

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

export default AdminLogin;
