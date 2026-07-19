import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiUploadCloud, FiRefreshCw, FiUser } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { refreshAll, isLoadingFiles } = useApp();
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/dashboard/files?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-background/80 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-6">
      <button onClick={onMenuClick} className="text-muted hover:text-white lg:hidden" aria-label="Open menu">
        <FiMenu className="h-6 w-6" />
      </button>

      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="input-field pl-10"
          aria-label="Search files"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => refreshAll()}
          className="btn-secondary !px-3"
          aria-label="Refresh"
          title="Refresh"
        >
          <FiRefreshCw className={`h-4 w-4 ${isLoadingFiles ? "animate-spin" : ""}`} />
        </button>

        <button onClick={() => navigate("/dashboard/upload")} className="btn-primary hidden sm:inline-flex">
          <FiUploadCloud className="h-4 w-4" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => navigate("/dashboard/upload")}
          className="btn-primary !px-3 sm:hidden"
          aria-label="Upload"
        >
          <FiUploadCloud className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"
            aria-label="Profile menu"
          >
            <FiUser className="h-4 w-4 text-white" />
          </button>
          {profileOpen && (
            <div
              className="glass-card absolute right-0 mt-2 w-48 py-2"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <p className="px-4 py-1.5 text-xs text-muted">Signed in as</p>
              <p className="px-4 pb-2 text-sm font-medium">cloud-engineer@portfolio.dev</p>
              <div className="border-t border-white/10" />
              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setProfileOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-white"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/about");
                  setProfileOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-white"
              >
                About this project
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
