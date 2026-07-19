import { motion } from "framer-motion";
import { FiCheck, FiX, FiRotateCcw, FiAlertTriangle } from "react-icons/fi";
import FileIcon from "./FileIcon.jsx";
import { formatBytes } from "../utils/formatters.js";

export default function UploadQueueItem({ item, onCancel, onRetry }) {
  const { file, progress, status } = item; // status: queued | uploading | success | error | cancelled
  const extension = file.name.split(".").pop();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card flex items-center gap-4 p-4"
    >
      <FileIcon extension={extension} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <span className="flex-shrink-0 text-xs text-muted">{formatBytes(file.size)}</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${status === "success" ? 100 : progress}%` }}
            className={`h-full rounded-full ${
              status === "error" ? "bg-red-400" : status === "success" ? "bg-emerald-400" : "bg-primary"
            }`}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-muted">
            {status === "uploading" && `Uploading... ${progress}%`}
            {status === "queued" && "Queued"}
            {status === "success" && "Upload complete"}
            {status === "error" && (item.errorMessage || "Upload failed")}
            {status === "cancelled" && "Cancelled"}
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {status === "success" && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
            <FiCheck className="h-4 w-4" />
          </span>
        )}
        {status === "error" && (
          <>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-400/10 text-red-400">
              <FiAlertTriangle className="h-4 w-4" />
            </span>
            <button
              onClick={() => onRetry(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted hover:bg-white/10 hover:text-white"
              aria-label="Retry upload"
            >
              <FiRotateCcw className="h-4 w-4" />
            </button>
          </>
        )}
        {(status === "uploading" || status === "queued") && (
          <button
            onClick={() => onCancel(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted hover:bg-white/10 hover:text-white"
            aria-label="Cancel upload"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
