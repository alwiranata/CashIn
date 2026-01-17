interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({ loading, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
