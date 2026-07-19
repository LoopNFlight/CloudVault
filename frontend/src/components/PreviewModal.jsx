import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiDownload, FiLoader } from "react-icons/fi";
import { filesApi } from "../services/api.js";
import { getFileCategory } from "../utils/formatters.js";

export default function PreviewModal({ file, onClose, onDownload }) {
  const [url, setUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const category = file ? getFileCategory(file.extension) : null;

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);
    setTextContent(null);

    filesApi
      .getDownloadUrl(file.key)
      .then(async ({ url: presignedUrl }) => {
        if (cancelled) return;
        setUrl(presignedUrl);
        if (category === "text") {
          const res = await fetch(presignedUrl);
          const text = await res.text();
          if (!cancelled) setTextContent(text.slice(0, 20000));
        }
      })
      .catch((err) => !cancelled && setErrorMsg(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="truncate pr-4 text-sm font-medium">{file.fileName}</p>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button onClick={() => onDownload(file)} className="btn-secondary !px-3 !py-1.5 text-xs">
                  <FiDownload className="h-3.5 w-3.5" /> Download
                </button>
                <button onClick={onClose} className="text-muted hover:text-white" aria-label="Close preview">
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto bg-black/20 p-6">
              {loading && <FiLoader className="h-8 w-8 animate-spin text-primary" />}
              {!loading && errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

              {!loading && !errorMsg && url && category === "image" && (
                <img src={url} alt={file.fileName} className="max-h-[65vh] rounded-lg object-contain" />
              )}
              {!loading && !errorMsg && url && category === "video" && (
                <video src={url} controls className="max-h-[65vh] w-full rounded-lg" />
              )}
              {!loading && !errorMsg && url && category === "audio" && (
                <audio src={url} controls className="w-full" />
              )}
              {!loading && !errorMsg && url && file.extension === "pdf" && (
                <iframe title={file.fileName} src={url} className="h-[65vh] w-full rounded-lg bg-white" />
              )}
              {!loading && !errorMsg && category === "text" && textContent !== null && (
                <pre className="max-h-[65vh] w-full overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-4 font-mono text-xs text-slate-300">
                  {textContent}
                </pre>
              )}
              {!loading && !errorMsg && !["image", "video", "audio", "text"].includes(category) && file.extension !== "pdf" && (
                <div className="text-center">
                  <p className="text-sm text-muted">Preview isn't available for this file type.</p>
                  <button onClick={() => onDownload(file)} className="btn-primary mt-4">
                    <FiDownload className="h-4 w-4" /> Download instead
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
