import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFolder } from "react-icons/fi";
import FileTable from "../components/FileTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PreviewModal from "../components/PreviewModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";

export default function MyFilesPage() {
  const { files, isLoadingFiles, downloadFile, copyDownloadLink, deleteFile } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const { term, setTerm, displayedFiles, isSearching, isActive } = useDebouncedSearch(files);
  const [previewFile, setPreviewFile] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) setTerm(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (term) setSearchParams({ q: term });
    else setSearchParams({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteFile(pendingDelete.key, pendingDelete.fileName).catch(() => {});
    setPendingDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">My Files</h1>
          <p className="mt-1 text-sm text-muted">
            {files.length} file{files.length !== 1 ? "s" : ""} stored in your S3 bucket.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by filename..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {isActive && isSearching && <p className="text-xs text-muted">Searching...</p>}

      {!isLoadingFiles && displayedFiles.length === 0 ? (
        <EmptyState
          icon={FiFolder}
          title={isActive ? "No matching files" : "No files yet"}
          description={
            isActive ? "Try a different search term." : "Upload your first file to get started."
          }
          actionLabel={isActive ? undefined : "Upload a file"}
          actionTo={isActive ? undefined : "/dashboard/upload"}
        />
      ) : (
        <FileTable
          files={displayedFiles}
          isLoading={isLoadingFiles}
          onPreview={setPreviewFile}
          onDownload={(file) => downloadFile(file.key, file.fileName)}
          onCopyLink={(file) => copyDownloadLink(file.key)}
          onDelete={(file) => setPendingDelete(file)}
        />
      )}

      <PreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={(file) => downloadFile(file.key, file.fileName)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this file?"
        description={`"${pendingDelete?.fileName}" will be permanently removed from S3. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
