import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import DropZone from "../components/DropZone.jsx";
import UploadQueueItem from "../components/UploadQueueItem.jsx";
import { useApp } from "../context/AppContext.jsx";

let queueId = 0;

export default function UploadPage() {
  const { uploadFile } = useApp();
  const [queue, setQueue] = useState([]);

  const runUpload = useCallback(
    async (id, file) => {
      setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: "uploading", progress: 5 } : q)));
      try {
        await uploadFile(file, (progress) => {
          setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, progress } : q)));
        });
        setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: "success", progress: 100 } : q)));
      } catch (err) {
        setQueue((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: "error", errorMessage: err.message } : q))
        );
      }
    },
    [uploadFile]
  );

  const handleFilesSelected = useCallback(
    (files) => {
      const newItems = files.map((file) => ({
        id: ++queueId,
        file,
        progress: 0,
        status: "queued",
      }));
      setQueue((prev) => [...newItems, ...prev]);
      newItems.forEach((item) => runUpload(item.id, item.file));
    },
    [runUpload]
  );

  function handleCancel(id) {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: "cancelled" } : q)));
  }

  function handleRetry(id) {
    const item = queue.find((q) => q.id === id);
    if (item) runUpload(id, item.file);
  }

  const successCount = queue.filter((q) => q.status === "success").length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Upload Files</h1>
        <p className="mt-1 text-sm text-muted">
          Drag and drop, or browse to upload directly to your S3 bucket via API Gateway + Lambda.
        </p>
      </div>

      <DropZone onFilesSelected={handleFilesSelected} />

      {successCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
        >
          <FiCheckCircle className="h-4 w-4" />
          {successCount} file{successCount > 1 ? "s" : ""} uploaded successfully.
        </motion.div>
      )}

      {queue.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Upload queue
          </h2>
          <AnimatePresence>
            {queue.map((item) => (
              <UploadQueueItem key={item.id} item={item} onCancel={handleCancel} onRetry={handleRetry} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
