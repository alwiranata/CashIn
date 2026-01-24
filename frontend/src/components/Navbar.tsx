type Props = {
  isMobile: boolean;
  onMenuClick: () => void;
};

const Navbar = ({ isMobile, onMenuClick }: Props) => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="text-2xl text-gray-700"
        >
         <i className="bi bi-list"></i>
        </button>
      )}

      <div className="flex items-center gap-5 ml-auto">
        <span>Admin</span>
        <img
          src="/profile.jpg"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Navbar;
