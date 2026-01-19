import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { loginApi } from "@/api/auth.api";
import type { LoginPayload } from "@/types/user";
import { setToken } from "@/utils/storage";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload: LoginPayload = {
      email: String(form.get("email")),
      password: String(form.get("password")),
    };

    try {
      const res = await loginApi(payload);
      // simpan
      setToken(res.data.data.token);

      // redirect ke dashboard
      navigate("/dashboard");
    } catch {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="email" label="Email" type="email" required />
          <Input name="password" label="Password" type="password" required />

          <Button type="submit" loading={loading}>
            Login
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
