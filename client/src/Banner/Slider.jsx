import React, { useState, useEffect } from 'react';
import '../Styles/slider.css';

const Slider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="slider-container">
      <div className="slider">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => setMinVal(Number(e.target.value))}
          className="thumb thumb--left"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => setMaxVal(Number(e.target.value))}
          className="thumb thumb--right"
        />
        <div className="slider-track"></div>
        <div
          className="slider-range"
          style={{
            left: `${((minVal - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxVal - min) / (max - min)) * 100}%`,
          }}
        ></div>
      </div>
      <div className="slider-values">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>
    </div>
  );
};

export default Slider;
