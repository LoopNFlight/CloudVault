import { FiCopy } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";

const APP_VERSION = "1.0.0";

function SettingRow({ label, value }) {
  const { pushToast } = useApp();
  return (
    <div className="flex flex-col gap-1 border-b border-white/5 py-4 last:border-none sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <code className="rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-200">{value}</code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            pushToast("Copied to clipboard.", "success");
          }}
          className="text-muted hover:text-white"
          aria-label={`Copy ${label}`}
        >
          <FiCopy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useApp();

  const bucketName = import.meta.env.VITE_BUCKET_NAME || "serverless-file-share-xxxxxxxxxxxx-prod";
  const region = import.meta.env.VITE_AWS_REGION || "us-east-1";
  const apiEndpoint = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">Infrastructure configuration for this deployment.</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-2 font-display text-base font-semibold">Infrastructure</h2>
        <SettingRow label="Bucket Name" value={bucketName} />
        <SettingRow label="AWS Region" value={region} />
        <SettingRow label="API Endpoint" value={apiEndpoint} />
        <SettingRow label="Application Version" value={APP_VERSION} />
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Theme</span>
          <button onClick={toggleTheme} className="btn-secondary">
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </div>
  );
}
