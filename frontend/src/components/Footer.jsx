import { Github, Linkedin, Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1220] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Cloud className="text-white w-6 h-6" />
            </div>

            <div>
              <h3 className="text-white text-lg font-bold">
                CloudVault
              </h3>

              <p className="text-slate-400 text-sm">
                Secure Serverless Cloud Storage
              </p>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <p className="text-slate-300 font-medium">
              Designed & Developed by
            </p>

            <h3 className="text-xl font-bold text-white mt-1">
              Mayank Sharma
            </h3>

            <p className="text-slate-500 text-sm mt-1">
              AWS Serverless | Cloud Computing | React
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">

            <a
              href="https://github.com/YOUR_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              <Github size={24} />
            </a>

            <a
              href="https://linkedin.com/in/YOUR_LINKEDIN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition"
            >
              <Linkedin size={24} />
            </a>

          </div>

        </div>

        <div className="border-t border-slate-800 mt-8 pt-5 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CloudVault. Built using AWS Lambda, Amazon S3,
            API Gateway & React.
          </p>
        </div>

      </div>
    </footer>
  );
}