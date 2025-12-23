import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerValidation, loginValidation } from "../validations";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ZodError } from "zod";
import { transporter } from "../lib/mailer";

export const register = async (req: Request, res: Response) => {
  try {
    //validate input
    const validated = registerValidation.parse(req.body);

    //check unique email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    //activation token
    const activationToken = crypto.randomBytes(32).toString("hex");

    //expire token
    const activationExpiredAt = new Date(Date.now() + 1000 * 60 * 60);

    //save user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        activationToken: activationToken,
        activationExpiredAt: activationExpiredAt,
      },
    });
    //send activationlink
    const activationLink = `${process.env.BASE_URL}/auth/activate/${activationToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Activate your CashIn account",
      html: `
      <h3>Welcome to CashIn</h3>
      <p>Click link below to activate your account:</p>
      <a href="${activationLink}">${activationLink}</a>
      <p>This link expires in 1 hour</p>
      `,
    });
    //response
    return res.status(201).json({
      message: "Regsiter Succes",
      data: {
        user: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    //zod error
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    // server error
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginValidation.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorect",
      });
    }

    if (user.status === "NONACTIVE") {
      return res.status(403).json({
        message: "Account is not active. Please contact admin",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email or password incorect",
      });
    }

    return res.status(200).json({
      message: "Login success",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          error: error,
        })),
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

export const activateToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({
        message: "Activation token is required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        activationToken: token,
        activationExpiredAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Activation token invailid or expired",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "ACTIVE",
        activationToken: null,
        activationExpiredAt: null,
      },
    });

    return res.status(200).json({
      meesage: "Account activated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
