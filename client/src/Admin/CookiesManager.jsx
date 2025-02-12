import React from 'react';
import PreferenceSection from './PreferenceSection';

function CookiesManager({ subsections, onAddSubsection, onUpdateSubsection, onDeleteSubsection }) {
  return (
    <div className="preferences-container">
      <h3>Manage Subsections</h3>
      <button className="preferences-button" onClick={onAddSubsection}>
        Add Subsection
      </button>
      {subsections.map((subsection, index) => (
        <PreferenceSection
          key={index}
          subsection={subsection}
          onUpdate={onUpdateSubsection}
          onDelete={onDeleteSubsection}
        />
      ))}
    </div>
  );
}

export default CookiesManager;
