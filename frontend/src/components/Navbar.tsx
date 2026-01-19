import { useNavigate } from "react-router-dom";
import { removeToken } from "@/utils/storage";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="font-semibold">Dashboard</h2>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
