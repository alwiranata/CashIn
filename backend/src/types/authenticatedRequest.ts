import { Request } from "express";
import { z } from "zod";
import { jwtPayloadSchema } from "../validations/jwtValidation";

export type jwtPayload = z.infer<typeof jwtPayloadSchema>;

export interface authenticatedRequest extends Request {
  user: jwtPayload;
}
