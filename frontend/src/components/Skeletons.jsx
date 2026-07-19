function Shimmer({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <Shimmer className="h-4 w-24" />
      <Shimmer className="mt-3 h-8 w-16" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="p-4"><Shimmer className="h-10 w-10 rounded-xl" /></td>
      <td className="p-4"><Shimmer className="h-4 w-40" /></td>
      <td className="p-4"><Shimmer className="h-4 w-16" /></td>
      <td className="p-4"><Shimmer className="h-4 w-20" /></td>
      <td className="p-4"><Shimmer className="h-4 w-28" /></td>
      <td className="p-4"><Shimmer className="h-4 w-12" /></td>
      <td className="p-4"><Shimmer className="h-8 w-24" /></td>
    </tr>
  );
}

export function CardSkeleton() {
  return <Shimmer className="h-40 w-full" />;
}
