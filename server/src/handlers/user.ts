import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import { ConflictError, InternalServerError, UnauthorizedError } from "../utils/errors";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password }: IUser = req.body;

    if (await User.exists({ email })) {
      throw new ConflictError("email already taken");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser: Partial<IUser> = await newUser.save();
    delete savedUser.password;

    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
};

/**
 * Handler for login route implements basic signing of JWT token
 **/
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: Partial<IUser> = req.body;

    const user = await User.findOne({ email });
    if (!user || !password) {
      throw new UnauthorizedError("invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      throw new UnauthorizedError("invalid username or password");
    }

    if (!process.env.JWT_SECRET) {
      throw new InternalServerError("authentication not setup");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    delete (user as Partial<IUser>).password;
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};
