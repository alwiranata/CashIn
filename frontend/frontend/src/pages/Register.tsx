import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { FormSuccess } from "@/components/FormSuccess";
import { registerApi } from "@/api/auth.api";
import type { RegisterPayload } from "@/types/user";

const Register = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload: RegisterPayload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    };

    try {
      await registerApi(payload);
      setSuccess("Register berhasil, silakan login");
      e.currentTarget.reset();
    } catch {
      setError("Email sudah terdaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {success && <FormSuccess message={success} />}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="Name" required />
          <Input name="email" label="Email" type="email" required />
          <Input
            name="password"
            label="Password"
            type="password"
            required
          />

          <Button type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-indigo-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
