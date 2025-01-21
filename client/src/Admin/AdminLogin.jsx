/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PreferenceSection from './PreferenceSection';

const AdminLogin = () => {
  const [subsections, setSubsections] = useState([]);

  async function fetchPreferences() {
    return await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
  };

  useEffect(() => {
    fetchPreferences().then(references => { setSubsections(references)});
  }, []);

  async function saveOrUpdate(section) {
    console.log('saveOrUpdate:', section)
    if(section._id)  {
      try {
        const response = await fetch(`http://localhost:3001/update-preference/${section._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(section),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully added preference:', data.preference);
        } else {
          console.error('Error adding preference');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/add-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(section),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully added preference:', data.preference);
          
        } else {
          console.error('Error adding preference');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchPreferences().then(references => { setSubsections(references)});
  }

  async function deletePref(section) {
    console.log('delete:', section)
    const response = await fetch(`http://localhost:3001/delete-preference/${section._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchPreferences().then(references => { setSubsections(references)});
  }

  console.log(subsections)

  return (
    <div style={styles.container}>
      <h2>Admin Panel</h2>
      <h3>Manage Subsections</h3>
      <button onClick={() => setSubsections(prev => [...prev, {adminId: 1}])} style={styles.addButton}>
        Add Subsection
      </button>

      {subsections.map((subsection, index) => (
        <PreferenceSection 
          key={ index} 
          subsection={subsection}
          onUpdate={(section) => saveOrUpdate(section)}
          onDelete={(section) => deletePref(section)}
        />
      ))}
      
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
