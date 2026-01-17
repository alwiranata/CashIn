export type Role = "ADMIN" | "USER";
export type StatusUser = "ACTIVE" | "NONACTIVE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: StatusUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
