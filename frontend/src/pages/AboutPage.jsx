import { FiServer, FiDatabase, FiZap, FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";

const AWS_SERVICES = [
  { name: "AWS Lambda", detail: "Node.js 22 functions for upload, list, download, delete, search, and stats." },
  { name: "Amazon API Gateway", detail: "REST API routing HTTP requests to each Lambda with CORS enabled." },
  { name: "Amazon S3", detail: "Encrypted, versioned object storage with lifecycle rules and presigned URLs." },
  { name: "IAM", detail: "Least-privilege roles scoped per-function (read-only vs. read/write)." },
  { name: "CloudWatch", detail: "Centralized logs and metrics for every Lambda invocation." },
];

const STACK = ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "React Icons", "Axios", "AWS SDK v3"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">About This Project</h1>
        <p className="mt-1 text-sm text-muted">A cloud-portfolio project built with true serverless AWS architecture.</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-2 font-display text-base font-semibold">Project Overview</h2>
        <p className="text-sm leading-relaxed text-muted">
          CloudVault is a Dropbox-style file sharing platform built to demonstrate production AWS
          serverless patterns. Every file operation — upload, list, search, download, and delete — is
          handled by an independent Lambda function behind API Gateway, backed by S3 for durable
          storage. There is no EC2 instance, no container, and no long-running server: capacity scales
          to zero when idle and elastically under load.
        </p>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Architecture</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ArchStep icon={FiZap} label="Client" detail="React SPA on Vercel" />
          <ArchStep icon={FiServer} label="API Gateway + Lambda" detail="6 REST endpoints" />
          <ArchStep icon={FiDatabase} label="Amazon S3" detail="Encrypted object storage" />
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold">AWS Services Used</h2>
        <ul className="space-y-3">
          {AWS_SERVICES.map((s) => (
            <li key={s.name} className="flex flex-col gap-0.5 border-b border-white/5 pb-3 last:border-none last:pb-0 sm:flex-row sm:gap-3">
              <span className="w-44 flex-shrink-0 text-sm font-medium text-white">{s.name}</span>
              <span className="text-sm text-muted">{s.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold">Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-3 font-display text-base font-semibold">Developer</h2>
        <p className="text-sm text-muted">
          Designed and built as a cloud engineering portfolio piece showcasing AWS Well-Architected
          serverless patterns end-to-end, from infrastructure-as-code to UI.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white" aria-label="GitHub">
            <FiGithub className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted hover:text-white" aria-label="LinkedIn">
            <FiLinkedin className="h-5 w-5" />
          </a>
          <a href="https://portfolio.dev" target="_blank" rel="noreferrer" className="text-muted hover:text-white" aria-label="Portfolio">
            <FiGlobe className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ArchStep({ icon: Icon, label, detail }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted">{detail}</p>
    </div>
  );
}
