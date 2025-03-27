export type ActiveView = 'cookies-manager' | 'product-manager';

export type AdminNavProps = {
  isLoggedIn: boolean;
  setShowLoginPopup: (show: boolean) => void;
  onLogout: () => void;
  setActiveView: (view: ActiveView) => void;
};
