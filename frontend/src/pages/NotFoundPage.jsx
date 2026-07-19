import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCloudOff } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5"
      >
        <FiCloudOff className="h-9 w-9 text-muted" />
      </motion.div>
      <h1 className="font-display text-6xl font-bold text-white">404</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        This object doesn't exist in the bucket. The page you're looking for may have been moved or deleted.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
