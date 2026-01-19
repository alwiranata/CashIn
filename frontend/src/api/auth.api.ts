import { api } from "@/utils/axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/types/user";

export const loginApi = (data: LoginPayload) => {
  return api.post<LoginResponse>("auth/login", data);
};

export const registerApi = (data: RegisterPayload) => {
  return api.post("/auth/register", data);
};
