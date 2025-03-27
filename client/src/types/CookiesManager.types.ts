import { Preference } from './PreferenceSection.types';

export interface CookiesManagerProps {
  subsections: Preference[];
  onAddSubsection: () => void;
  onUpdateSubsection: (subsection: Preference) => Promise<void> | void;
  onDeleteSubsection: (subsection: Preference) => Promise<void> | void;
}
