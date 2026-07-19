import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, suffix = "", accent = "primary", trend }) {
  const accentClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    accent: "from-accent/20 to-accent/5 text-accent",
    emerald: "from-emerald-400/20 to-emerald-400/5 text-emerald-400",
    amber: "from-amber-400/20 to-amber-400/5 text-amber-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card relative overflow-hidden p-5"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-40 blur-xl ${accentClasses[accent]}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            {value}
            {suffix}
          </p>
          {trend && <p className="mt-1 text-xs text-emerald-400">{trend}</p>}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accentClasses[accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
