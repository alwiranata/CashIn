import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold p-4 border-b border-gray-700">
        CashIn
      </h1>

      <nav className="p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className="block px-4 py-2 rounded hover:bg-gray-800">
          Tasks
        </NavLink>

        <NavLink
          to="/transactions"
          className="block px-4 py-2 rounded hover:bg-gray-800"
        >
          Transactions
        </NavLink>

        <NavLink to="/users" className="block px-4 py-2 rounded hover:bg-gray-800">
          Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
