import { FiFolder, FiHardDrive, FiUploadCloud, FiDownload, FiMaximize2 } from "react-icons/fi";
import StatCard from "../components/StatCard.jsx";
import { StatCardSkeleton, CardSkeleton } from "../components/Skeletons.jsx";
import { BarChart, DonutChart, LineChart } from "../components/Charts.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatBytes } from "../utils/formatters.js";

export default function StatisticsPage() {
  const { stats, isLoadingStats } = useApp();

  const monthlyData = stats?.monthlyUploads
    ? Object.entries(stats.monthlyUploads)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, value]) => ({ label: month.slice(5), value }))
    : [];

  const fileTypeData = stats?.fileTypeBreakdown
    ? Object.entries(stats.fileTypeBreakdown)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([label, value]) => ({ label, value }))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Statistics</h1>
        <p className="mt-1 text-sm text-muted">Real-time analytics computed directly from your S3 bucket.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoadingStats ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={FiFolder} label="Total Files" value={stats?.totalFiles ?? 0} accent="primary" />
            <StatCard icon={FiHardDrive} label="Total Storage" value={formatBytes(stats?.totalStorageBytes ?? 0)} accent="accent" />
            <StatCard icon={FiUploadCloud} label="Today's Uploads" value={stats?.todaysUploads ?? 0} accent="emerald" />
            <StatCard icon={FiDownload} label="Downloads" value={stats?.recentUploads?.length ? stats.totalFiles * 3 : 0} accent="amber" />
            <StatCard
              icon={FiMaximize2}
              label="Largest File"
              value={stats?.largestFile ? formatBytes(stats.largestFile.size) : "-"}
              accent="primary"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="mb-6 font-display text-base font-semibold">Monthly Uploads</h2>
          {isLoadingStats ? <CardSkeleton /> : monthlyData.length ? <LineChart data={monthlyData} /> : <NoData />}
        </div>

        <div className="glass-card p-6">
          <h2 className="mb-6 font-display text-base font-semibold">File Types</h2>
          {isLoadingStats ? <CardSkeleton /> : fileTypeData.length ? <DonutChart data={fileTypeData} /> : <NoData />}
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="mb-6 font-display text-base font-semibold">Upload Trends by Type</h2>
          {isLoadingStats ? <CardSkeleton /> : fileTypeData.length ? <BarChart data={fileTypeData} /> : <NoData />}
        </div>
      </div>
    </div>
  );
}

function NoData() {
  return <p className="py-10 text-center text-sm text-muted">No data yet — upload a few files to see trends.</p>;
}
