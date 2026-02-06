import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Tasks from "./pages/Tables/Tasks";
import Transactions from "./pages/Tables/Transactions";
import Users from "./pages/Tables/Users";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Dashboard/Home";

import "bootstrap-icons/font/bootstrap-icons.css";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route index element={<Home />} />

            {/* Others */}
            <Route path="profile" element={<UserProfiles />} />

            {/* Forms */}
            <Route path="form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="task-tables" element={<Tasks />} />
            <Route path="transaction-tables" element={<Transactions />} />

            {/* Hanya admin yang bisa akses dan lihat user-tables */}
            <Route
              element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
              <Route path="user-tables" element={<Users />} />
            </Route>
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
