import { api } from "@/utils/axios";
import type { LoginPayload, RegisterPayload, User } from "@/types/user";

interface LoginResponse {
  token: string;
  user: User;
}

export const loginApi = (data: LoginPayload) => {
  return api.post<LoginResponse>("auth/login", data);
};

export const registerApi = (data: RegisterPayload) => {
  return api.post("/auth/register", data);
};
