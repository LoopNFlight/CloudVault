import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { filesApi } from "../services/api.js";

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState("dark");

  const pushToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    setError(null);
    try {
      const data = await filesApi.list();
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
      pushToast(err.message || "Could not reach the API.", "error");
    } finally {
      setIsLoadingFiles(false);
    }
  }, [pushToast]);

  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await filesApi.getStatistics();
      setStats(data);
    } catch (err) {
      pushToast(err.message || "Could not load statistics.", "error");
    } finally {
      setIsLoadingStats(false);
    }
  }, [pushToast]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshFiles(), refreshStats()]);
  }, [refreshFiles, refreshStats]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const uploadFile = useCallback(
    async (file, onProgress) => {
      try {
        const result = await filesApi.upload(file, { onProgress });
        pushToast(`"${file.name}" uploaded successfully.`, "success");
        await refreshAll();
        return result;
      } catch (err) {
        pushToast(`Upload failed for "${file.name}": ${err.message}`, "error");
        throw err;
      }
    },
    [pushToast, refreshAll]
  );

  const deleteFile = useCallback(
    async (key, fileName) => {
      try {
        await filesApi.remove(key);
        setFiles((prev) => prev.filter((f) => f.key !== key));
        pushToast(`"${fileName}" deleted.`, "success");
        refreshStats();
      } catch (err) {
        pushToast(`Delete failed: ${err.message}`, "error");
        throw err;
      }
    },
    [pushToast, refreshStats]
  );

  const copyDownloadLink = useCallback(
    async (key) => {
      try {
        const { url } = await filesApi.getDownloadUrl(key);
        await navigator.clipboard.writeText(url);
        pushToast("Download link copied to clipboard (valid 15 minutes).", "success");
        return url;
      } catch (err) {
        pushToast(`Could not copy link: ${err.message}`, "error");
        throw err;
      }
    },
    [pushToast]
  );

  const downloadFile = useCallback(
    async (key, fileName) => {
      try {
        const { url } = await filesApi.getDownloadUrl(key);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "";
        document.body.appendChild(link);
        link.click();
        link.remove();
        refreshStats();
      } catch (err) {
        pushToast(`Download failed: ${err.message}`, "error");
        throw err;
      }
    },
    [pushToast, refreshStats]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      files,
      stats,
      isLoadingFiles,
      isLoadingStats,
      error,
      toasts,
      theme,
      pushToast,
      dismissToast,
      refreshFiles,
      refreshStats,
      refreshAll,
      uploadFile,
      deleteFile,
      copyDownloadLink,
      downloadFile,
      toggleTheme,
    }),
    [
      files,
      stats,
      isLoadingFiles,
      isLoadingStats,
      error,
      toasts,
      theme,
      pushToast,
      dismissToast,
      refreshFiles,
      refreshStats,
      refreshAll,
      uploadFile,
      deleteFile,
      copyDownloadLink,
      downloadFile,
      toggleTheme,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
