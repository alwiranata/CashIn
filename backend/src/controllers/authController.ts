import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerValidation, loginValidation } from "../validations";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ZodError } from "zod";
import { transporter } from "../lib/mailer";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

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
    const activationLink = `${process.env.BASE_URL}/api/auth/activate/${activationToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Activate your CashIn account",
      html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#2563eb; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">CashIn</h1>
      </div>

      <!-- Content -->
      <div style="padding:30px; color:#333;">
        <h2 style="margin-top:0;">Welcome to CashIn 👋</h2>
        <p>Hi <strong>${user.name}</strong>,</p>

        <p>
          Thank you for registering at <strong>CashIn</strong>.
          Please confirm your email address by clicking the button below:
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${activationLink}"
            style="
              background:#2563eb;
              color:#ffffff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              display:inline-block;
            ">
            Activate Account
          </a>
        </div>

        <p>
          This activation link will expire in <strong>1 hour</strong>.
          If you did not create this account, please ignore this email.
        </p>

        <p style="font-size:14px; color:#666;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break:break-all; font-size:13px; color:#2563eb;">
          ${activationLink}
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#555;">
        © ${new Date().getFullYear()} CashIn. All rights reserved.
      </div>

    </div>
  </div>
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
        message: "Account is not active. Please check your email or contact admin",
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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtConfig.secret,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login success",
      data: {
        token: token,
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

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Account Activated</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5, #22c55e);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            width: 420px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .icon {
            font-size: 64px;
            color: #22c55e;
          }
          h1 {
            margin: 20px 0 10px;
          }
          p {
            color: #555;
          }
          a {
            display: inline-block;
            margin-top: 25px;
            padding: 12px 24px;
            background: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
          }
          a:hover {
            background: #4338ca;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h1>Account Activated</h1>
          <p>Your account has been successfully activated.</p>
          <p>You can now login and start using CashIn.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
