import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SliderProps } from '../types/Slider.types';
import '../Styles/slider.css';

export default function Slider(props: SliderProps) {
  const { min, max, onChange } = props;
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);

  const debouncedOnChange = useDebouncedCallback((min, max) => {
    onChange({ min, max });
  }, 500);

  useEffect(() => {
    debouncedOnChange(minVal, maxVal);
  }, [minVal, maxVal, debouncedOnChange]);

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
}
