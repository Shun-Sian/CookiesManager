/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PreferenceSection from './PreferenceSection';
import '../Styles/admin-login.css';

const AdminLogin = () => {
  const [subsections, setSubsections] = useState([]);

  async function fetchPreferences() {
    return await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
  }

  useEffect(() => {
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }, []);

  async function saveOrUpdate(section) {
    console.log('saveOrUpdate:', section);
    if (section._id) {
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
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }

  async function deletePref(section) {
    console.log('delete:', section);
    const response = await fetch(`http://localhost:3001/delete-preference/${section._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }

  console.log(subsections);

  return (
    <div className="preferences-container">
      <h2>Admin Panel</h2>
      <h3>Manage Subsections</h3>
      <button className="preferences-button" onClick={() => setSubsections((prev) => [...prev, { adminId: 1 }])}>
        Add Subsection
      </button>

      {subsections.map((subsection, index) => (
        <PreferenceSection
          key={index}
          subsection={subsection}
          onUpdate={(section) => saveOrUpdate(section)}
          onDelete={(section) => deletePref(section)}
        />
      ))}
    </div>
  );
};

export default AdminLogin;
