import { NavLink } from "react-router-dom";
import { LayoutDashboard, Search, BarChart2, X } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search Scores", icon: Search },
  { to: "/reports", label: "Reports", icon: BarChart2 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        shrink-0 flex flex-col pt-8 px-6 bg-sidebar-bg border-r border-blue-200 z-30
        transition-transform duration-300 ease-in-out
        fixed top-16 left-0 h-[calc(100%-4rem)] w-56
        lg:static lg:top-auto lg:h-auto lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:flex
      `}
    >
      <button
        onClick={onClose}
        className="lg:hidden absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-md text-blue-900/60 hover:bg-blue-100 transition-colors"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>

      <p className="text-xs font-semibold text-blue-900/60 mb-6 tracking-widest uppercase">
        Menu
      </p>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? "font-semibold text-white bg-primary shadow-sm"
                  : "font-medium text-blue-900 hover:text-primary hover:bg-blue-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
