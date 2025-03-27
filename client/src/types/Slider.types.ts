export interface SliderProps {
  min: number;
  max: number;
  onChange: (value: { min: number; max: number }) => void;
}
