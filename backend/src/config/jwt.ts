import { Sign } from "crypto";
import { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const jwtConfig: {
  secret: Secret;
} = {
  secret: JWT_SECRET,
};
