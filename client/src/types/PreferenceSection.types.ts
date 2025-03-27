export type Preference = {
  _id?: string;
  title?: string;
  content?: string;
  adminId?: number;
};

export interface PreferenceSectionProps {
  subsection: Preference;
  onUpdate: (updatedSection: Preference) => void;
  onDelete: (sectionToDelete: Preference) => void;
}
