import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUploadCloud,
  FiGrid,
  FiCloud,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiZap,
  FiDatabase,
  FiShield,
  FiServer,
} from "react-icons/fi";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import { useApp } from "../context/AppContext.jsx";
import { formatBytes } from "../utils/formatters.js";

const FEATURES = [
  {
    icon: FiServer,
    title: "AWS Lambda",
    description: "Six single-purpose Node.js 22 functions handle upload, list, search, download, delete and stats — no servers to patch or scale.",
  },
  {
    icon: FiDatabase,
    title: "Amazon S3",
    description: "Encrypted, versioned object storage with lifecycle rules and least-privilege bucket policies backing every file.",
  },
  {
    icon: FiZap,
    title: "API Gateway",
    description: "A REST API fronts every Lambda with CORS, throttling, and request validation baked in.",
  },
  {
    icon: FiShield,
    title: "Cloud Security",
    description: "IAM least-privilege roles, presigned URLs that expire in 15 minutes, and blocked file types keep the bucket safe.",
  },
];

export default function LandingPage() {
  const { stats } = useApp();

  const heroStats = [
    { label: "Files Uploaded", value: stats?.totalFiles ?? 128, suffix: "" },
    { label: "Storage Used", value: stats ? +(stats.totalStorageMB || 0).toFixed(1) : 42.6, suffix: " MB" },
    { label: "Downloads", value: stats?.recentUploads?.length ? stats.totalFiles * 3 : 340, suffix: "" },
    { label: "Serverless API Calls", value: 12800, suffix: "+" },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* NAV */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
            <FiCloud className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">CloudVault</span>
        </div>
        <Link to="/dashboard" className="btn-secondary">
          View Dashboard
        </Link>
      </header>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-16 sm:pt-24">
        {/* floating gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-10 h-72 w-72 animate-float-slow rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute right-1/4 top-32 h-72 w-72 animate-float rounded-full bg-accent/20 blur-[100px]" />
          <FiCloud className="absolute left-[10%] top-40 h-16 w-16 animate-float text-white/5" />
          <FiCloud className="absolute right-[12%] top-24 h-24 w-24 animate-float-slow text-white/5" />
          <FiCloud className="absolute left-[20%] bottom-10 h-12 w-12 animate-float text-white/5" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Built on AWS Lambda, API Gateway &amp; S3
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            Secure Serverless {" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cloud Storage
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
          >
            Securely upload, manage, preview, and share files using AWS Serverless Cloud Architecture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/dashboard/upload" className="btn-primary px-6 py-3 text-base">
              <FiUploadCloud className="h-5 w-5" /> Upload Files
            </Link>
            <Link to="/dashboard" className="btn-secondary px-6 py-3 text-base">
              <FiGrid className="h-5 w-5" /> View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 text-center"
            >
              <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                <AnimatedCounter value={s.value} decimals={s.suffix === " MB" ? 1 : 0} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-xs text-muted sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold">Powered by real AWS services</h2>
          <p className="mt-2 text-muted">A true serverless architecture — no EC2, no containers, no idle servers.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm px-6 py-12">
  <div className="mx-auto max-w-6xl">

    <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

      {/* Left */}
      <div className="text-center md:text-left">
        <h3 className="font-display text-2xl font-bold text-white">
          CloudVault
        </h3>

        <p className="mt-2 text-sm text-muted max-w-md">
          A modern serverless cloud storage platform powered by
          AWS Lambda, Amazon S3 and API Gateway.
          Built as a production-ready cloud computing project.
        </p>
      </div>

      {/* Right */}
      <div className="text-center md:text-right">

        <p className="text-sm text-muted">
          Designed & Developed by
        </p>

        <h4 className="mt-1 text-lg font-semibold text-white">
          Mayank Sharma
        </h4>

        <p className="text-xs text-muted mt-1">
          AWS Cloud Engineer | Serverless Architect | AI Developer
        </p>

        <div className="mt-5 flex justify-center md:justify-end gap-5">

          <a
            href="https://github.com/LoopNFlight"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-primary"
          >
            <FiGithub className="h-6 w-6" />
          </a>

          <a
            href="https://www.linkedin.com/in/mayank-sharma-dev"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-primary"
          >
            <FiLinkedin className="h-6 w-6" />
          </a>

          <a
            href="https://YOUR_PORTFOLIO.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-primary"
          >
            <FiGlobe className="h-6 w-6" />
          </a>

        </div>

      </div>

    </div>

    <div className="my-8 h-px bg-white/10"></div>

    <div className="flex flex-col items-center justify-between gap-3 md:flex-row">

      <p className="text-xs text-muted">
        © {new Date().getFullYear()} CloudVault. All Rights Reserved.
      </p>

      <p className="text-xs text-muted">
        Built with React • AWS Lambda • Amazon S3 • API Gateway • CloudFormation
      </p>

    </div>

    {stats && (
      <div className="mt-6 text-center text-xs text-muted">
        Live Storage:
        <span className="text-white font-medium">
          {" "}
          {stats.totalFiles}
        </span>
        {" "}files •
        <span className="text-white font-medium">
          {" "}
          {formatBytes(stats.totalStorageBytes)}
        </span>
        {" "}used
      </div>
    )}

  </div>
</footer>
    </div>
  );
}
