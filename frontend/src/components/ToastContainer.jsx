import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";

const STYLES = {
  success: { icon: FiCheckCircle, color: "text-emerald-400", border: "border-emerald-400/30" },
  error: { icon: FiXCircle, color: "text-red-400", border: "border-red-400/30" },
  info: { icon: FiInfo, color: "text-primary", border: "border-primary/30" },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { icon: Icon, color, border } = STYLES[toast.type] || STYLES.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`glass-card flex items-start gap-3 border ${border} p-4`}
              role="status"
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${color}`} />
              <p className="flex-1 text-sm text-slate-200">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-muted transition-colors hover:text-white"
                aria-label="Dismiss notification"
              >
                <FiX className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
