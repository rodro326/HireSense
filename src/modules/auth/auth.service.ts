import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return secret;
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};