import { useState } from 'react';
import '../Styles/expandable-text.css';

export default function ExpandableText({ title, description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="expandableText-container">
      <button className="expandableText-button" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <h3 className="expandableText-title">{title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`expandableText-svg ${isExpanded ? 'svg-rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'inline-block', transformOrigin: 'center' }}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="">
          <p className="expandableText-content">{description}</p>
        </div>
      )}
    </div>
  );
}
