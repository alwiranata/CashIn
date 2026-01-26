export type Role = "ADMIN" | "USER";
export type StatusUser = "ACTIVE" | "NONACTIVE";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    id: number;
    email: string;
    role: Role;
    status: StatusUser;
  };
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
