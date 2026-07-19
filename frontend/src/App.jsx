import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import MyFilesPage from "./pages/MyFilesPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="files" element={<MyFilesPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
