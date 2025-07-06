export interface Route {
  id: number;
  link: string;
  title: string;
  menu?: string;
  mainPath: string;
  permission?: string;
  icon: React.ReactElement;
  isCollapse: boolean;
  isShow: boolean;
  submenus: RouteSubmenu[];
}

export interface RouteSubmenu {
  id: number;
  link: string;
  title: string;
  icon?: React.ReactElement;
  permission?: string;
  submenus: Submenu[];
}

export interface Submenu {
  id: number;
  link: string;
  title: string;
}
