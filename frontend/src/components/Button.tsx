interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({ loading, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
