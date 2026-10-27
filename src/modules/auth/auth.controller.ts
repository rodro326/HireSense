import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
} from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};