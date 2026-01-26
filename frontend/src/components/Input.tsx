interface InputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

export const Input = ({
  name,
  label,
  type = "text",
  required,
}: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
};
