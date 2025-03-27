export interface HomeNavProps {
  isLoggedIn: boolean;
  setShowLoginPopup: (show: boolean) => void;
  onLogout: () => void;
}
