import React from 'react';
import PreferenceSection from './PreferenceSection';
import type { CookiesManagerProps } from '../types/CookiesManager.types';

export default function CookiesManager(props: CookiesManagerProps) {
  const { subsections, onAddSubsection, onUpdateSubsection, onDeleteSubsection } = props;
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
