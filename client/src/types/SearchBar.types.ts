export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}
