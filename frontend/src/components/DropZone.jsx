import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

const ACCEPTED_EXTENSIONS = [
  "png", "jpg", "jpeg", "gif", "webp", "svg",
  "mp4", "mov", "webm", "avi",
  "pdf", "zip",
  "docx", "doc",
  "pptx", "ppt",
  "txt", "csv",
];

export default function DropZone({ onFilesSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList).filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return ACCEPTED_EXTENSIONS.includes(ext);
      });
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      animate={{
        borderColor: isDragging ? "#3B82F6" : "rgba(255,255,255,0.12)",
        backgroundColor: isDragging ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
        scale: isDragging ? 1.01 : 1,
      }}
      className="glass-card flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-16 text-center transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        accept={ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(",")}
      />
      <motion.div
        animate={{ y: isDragging ? -6 : 0 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
      >
        <FiUploadCloud className="h-7 w-7 text-primary" />
      </motion.div>
      <h3 className="font-display text-lg font-semibold">
        {isDragging ? "Drop to upload" : "Drag & drop files here"}
      </h3>
      <p className="mt-1.5 text-sm text-muted">or click to browse from your device</p>
      <p className="mt-4 text-xs text-muted">
        Supports images, video, PDF, ZIP, DOCX, PPTX, TXT, CSV &middot; up to 100MB per file
      </p>
    </motion.div>
  );
}
