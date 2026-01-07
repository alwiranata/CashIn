import { Request } from "express";
import { z } from "zod";
import { jwtPayloadSchema } from "../validations/jwtValidation";

export type jwtPayload = z.infer<typeof jwtPayloadSchema>;

export interface userRequest extends Request {
  user: jwtPayload;
}
