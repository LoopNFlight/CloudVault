import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFolder, FiHardDrive, FiUploadCloud as FiUploadIcon, FiTrendingUp } from "react-icons/fi";
import StatCard from "../components/StatCard.jsx";
import { StatCardSkeleton } from "../components/Skeletons.jsx";
import EmptyState from "../components/EmptyState.jsx";
import FileIcon from "../components/FileIcon.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatBytes, timeAgo } from "../utils/formatters.js";

export default function DashboardHome() {
  const { files, stats, isLoadingFiles, isLoadingStats } = useApp();
  const recentFiles = files.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Welcome back 👋</h1>
        <p className="text-sm text-muted">Here's what's happening with your files.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={FiFolder} label="Total Files" value={stats?.totalFiles ?? 0} accent="primary" />
            <StatCard
              icon={FiHardDrive}
              label="Storage Used"
              value={formatBytes(stats?.totalStorageBytes ?? 0)}
              accent="accent"
            />
            <StatCard icon={FiUploadIcon} label="Today's Uploads" value={stats?.todaysUploads ?? 0} accent="emerald" />
            <StatCard
              icon={FiTrendingUp}
              label="Largest File"
              value={stats?.largestFile ? formatBytes(stats.largestFile.size) : "-"}
              accent="amber"
            />
          </>
        )}
      </div>

      <div className="glass-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent uploads</h2>
          <Link to="/dashboard/files" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {isLoadingFiles ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : recentFiles.length === 0 ? (
          <EmptyState
            title="No files yet"
            description="Upload your first file to see it appear here."
            actionLabel="Upload a file"
            actionTo="/dashboard/upload"
          />
        ) : (
          <div className="space-y-2">
            {recentFiles.map((file, i) => (
              <motion.div
                key={file.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/5"
              >
                <FileIcon extension={file.extension} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.fileName}</p>
                  <p className="text-xs text-muted">
                    {formatBytes(file.size)} &middot; {timeAgo(file.uploadDate)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
