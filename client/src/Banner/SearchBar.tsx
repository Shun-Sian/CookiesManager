import React from 'react';
import { SearchBarProps } from '../types/SearchBar.types';
import '../Styles/search-bar.css';

export default function SearchBar(props: SearchBarProps) {
  const { value, onChange, onClear } = props;
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search products..." value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button onClick={onClear} className="clear-search-button">
          &times;
        </button>
      )}
    </div>
  );
}
