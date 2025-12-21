import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerValidation, loginValidation } from "../validations";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    //1.validate input
    const validated = registerValidation.parse(req.body);

    //2.check unique email
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    //3.hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    //4.save user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: validated.password,
      },
    });

    //5.response
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
    // ✅ HANDLE ERROR LAIN
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
