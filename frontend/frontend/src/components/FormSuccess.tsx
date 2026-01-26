interface Props {
  message: string;
}

export const FormSuccess = ({ message }: Props) => {
  return (
    <div className="bg-green-100 text-green-700 p-3 rounded mb-3 text-sm">
      {message}
    </div>
  );
};
