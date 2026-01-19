import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />
        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
