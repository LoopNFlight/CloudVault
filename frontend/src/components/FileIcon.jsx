import {
  FiFile,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiArchive,
} from "react-icons/fi";
import { FaRegFilePdf, FaRegFileWord, FaRegFilePowerpoint, FaRegFileExcel } from "react-icons/fa6";
import { getFileCategory } from "../utils/formatters.js";

const CATEGORY_STYLES = {
  pdf: { icon: FaRegFilePdf, color: "text-red-400", bg: "bg-red-400/10" },
  doc: { icon: FaRegFileWord, color: "text-blue-400", bg: "bg-blue-400/10" },
  ppt: { icon: FaRegFilePowerpoint, color: "text-orange-400", bg: "bg-orange-400/10" },
  sheet: { icon: FaRegFileExcel, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  archive: { icon: FiArchive, color: "text-amber-400", bg: "bg-amber-400/10" },
  image: { icon: FiImage, color: "text-purple-400", bg: "bg-purple-400/10" },
  video: { icon: FiVideo, color: "text-pink-400", bg: "bg-pink-400/10" },
  audio: { icon: FiMusic, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  text: { icon: FiFileText, color: "text-slate-300", bg: "bg-slate-400/10" },
  file: { icon: FiFile, color: "text-muted", bg: "bg-white/5" },
};

export default function FileIcon({ extension, size = "md", className = "" }) {
  const category = getFileCategory(extension);
  const { icon: Icon, color, bg } = CATEGORY_STYLES[category];
  const dimensions = size === "lg" ? "h-12 w-12 text-2xl" : size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-lg";

  return (
    <div className={`flex items-center justify-center rounded-xl ${bg} ${dimensions} ${className}`}>
      <Icon className={color} />
    </div>
  );
}
