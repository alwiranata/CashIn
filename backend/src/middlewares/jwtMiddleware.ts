import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";
import { jwtPayloadSchema } from "../validations/jwtValidation";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const jwtMiddleware = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const parsed = jwtPayloadSchema.safeParse(decoded);
    if (!parsed.success) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = parsed.data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.issues.map((err) => ({
          error: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
