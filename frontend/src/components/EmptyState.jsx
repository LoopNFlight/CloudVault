import { FiInbox } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon = FiInbox,
  title = "Nothing here yet",
  description = "Get started by uploading your first file.",
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-7 w-7 text-muted" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-muted">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
