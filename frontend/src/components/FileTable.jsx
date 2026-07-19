import { useMemo, useState } from "react";
import { FiEye, FiDownload, FiLink, FiTrash2, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FileIcon from "./FileIcon.jsx";
import { formatBytes, formatDate } from "../utils/formatters.js";
import { TableRowSkeleton } from "./Skeletons.jsx";

const PAGE_SIZE = 8;

export default function FileTable({ files, isLoading, onPreview, onDownload, onCopyLink, onDelete }) {
  const [sortKey, setSortKey] = useState("uploadDate");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const copy = [...files];
    copy.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "uploadDate") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else if (sortKey === "fileName") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [files, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  function SortHeader({ label, sortKeyName }) {
    const active = sortKey === sortKeyName;
    return (
      <button
        onClick={() => toggleSort(sortKeyName)}
        className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide ${
          active ? "text-white" : "text-muted"
        } hover:text-white`}
      >
        {label}
        {active && (sortDir === "asc" ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />)}
      </button>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-4"></th>
              <th className="p-4"><SortHeader label="Filename" sortKeyName="fileName" /></th>
              <th className="p-4 text-xs font-medium uppercase tracking-wide text-muted">Extension</th>
              <th className="p-4"><SortHeader label="Size" sortKeyName="size" /></th>
              <th className="p-4"><SortHeader label="Uploaded" sortKeyName="uploadDate" /></th>
              <th className="p-4 text-xs font-medium uppercase tracking-wide text-muted">Downloads</th>
              <th className="p-4 text-xs font-medium uppercase tracking-wide text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}

            {!isLoading &&
              pageItems.map((file) => (
                <tr key={file.key} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="p-4">
                    <FileIcon extension={file.extension} size="sm" />
                  </td>
                  <td className="max-w-[220px] truncate p-4 text-sm font-medium" title={file.fileName}>
                    {file.fileName}
                  </td>
                  <td className="p-4 text-sm uppercase text-muted">{file.extension || "-"}</td>
                  <td className="p-4 text-sm text-muted">{formatBytes(file.size)}</td>
                  <td className="p-4 text-sm text-muted">{formatDate(file.uploadDate)}</td>
                  <td className="p-4 text-sm text-muted">{file.downloadCount ?? 0}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <ActionButton icon={FiEye} label="Preview" onClick={() => onPreview(file)} />
                      <ActionButton icon={FiDownload} label="Download" onClick={() => onDownload(file)} />
                      <ActionButton icon={FiLink} label="Copy link" onClick={() => onCopyLink(file)} />
                      <ActionButton icon={FiTrash2} label="Delete" danger onClick={() => onDelete(file)} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
          <p className="text-xs text-muted">
            Page {page + 1} of {totalPages} &middot; {sorted.length} files
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary !px-2.5 !py-1.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary !px-2.5 !py-1.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 ${
        danger ? "hover:text-red-400" : "hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
