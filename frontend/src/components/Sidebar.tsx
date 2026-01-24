import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "@/utils/storage";

const menuClass = (isActive: boolean) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg transition
   ${
     isActive
       ? "bg-indigo-600 text-white"
       : "text-gray-300 hover:bg-gray-800 hover:text-white"
   }`;

const menus = [
  { to: "/dashboard", label: "Dashboard", icon: "bi bi-bar-chart", end: true },
  { to: "/dashboard/task", label: "Tasks", icon: "bi bi-journal-bookmark" },
  {
    to: "/dashboard/transaction",
    label: "Transactions",
    icon: "bi bi-cash-coin",
  },
  { to: "/dashboard/user", label: "Users", icon: "bi bi-person-add" },
];

type Props = {
  isOpen: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
};

const Sidebar = ({ isOpen, isMobile, onToggle, onClose }: Props) => {
  const navigate = useNavigate();

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <aside
        className={`
          fixed z-50 bg-gray-900 text-white min-h-screen transition-all duration-300
          ${isMobile ? "w-64" : isOpen ? "w-64" : "w-20"}
          ${isMobile ? "left-0 top-0" : "relative"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          {/* LOGO + TITLE */}
          <div className="flex items-center gap-3">
            <i className="bi bi-wallet2 text-indigo-500 text-xl" />

            {(isOpen || isMobile) && (
              <h1 className="text-xl font-bold whitespace-nowrap">
                Cash<span className="text-indigo-500">In</span>
              </h1>
            )}
          </div>

          {/* BUTTON */}
          {!isMobile ? (
            // DESKTOP → COLLAPSE
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition"
            >
              {isOpen ? "❮" : "❯"}
            </button>
          ) : (
            // MOBILE → CLOSE (X)
            <button
              onClick={onClose}
              className="text-gray-400  hover:text-red-600 text-xl transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="px-2 py-6 space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.end}
              className={({ isActive }) => menuClass(isActive)}
              onClick={isMobile ? onClose : undefined}
            >
              <i className={`${menu.icon} text-4`} />
              {(isOpen || isMobile) && <span>{menu.label}</span>}
            </NavLink>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg
                       text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            <i className="bi bi-box-arrow-in-right text-lg" />
            {(isOpen || isMobile) && <span>Logout</span>}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
