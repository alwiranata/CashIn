import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 500;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // mobile = sidebar tertutup
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      {!isMobile && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* CONTENT */}
      <div className="flex-1">
        <Navbar
          isMobile={isMobile}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* SIDEBAR MOBILE (OVERLAY) */}
        {isMobile && isSidebarOpen && (
          <Sidebar
            isOpen
            isMobile
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
