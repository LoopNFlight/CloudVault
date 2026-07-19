import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiUploadCloud,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiInfo,
  FiCloud,
  FiSun,
  FiMoon,
  FiX,
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/dashboard/upload", label: "Upload", icon: FiUploadCloud },
  { to: "/dashboard/files", label: "My Files", icon: FiFolder },
  { to: "/dashboard/statistics", label: "Statistics", icon: FiBarChart2 },
  { to: "/dashboard/settings", label: "Settings", icon: FiSettings },
  { to: "/dashboard/about", label: "About", icon: FiInfo },
];

export default function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useApp();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-surface/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <FiCloud className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">CloudVault</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white lg:hidden" aria-label="Close menu">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${
                theme === "dark" ? "bg-primary" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
