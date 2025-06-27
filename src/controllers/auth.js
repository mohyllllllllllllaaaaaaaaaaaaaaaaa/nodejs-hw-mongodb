import createHttpError from "http-errors";
import { registerUser } from "../services/auth.js"; 
import bcrypt from 'bcrypt';
import { UsersCollection } from "../models/user.js";

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await registerUser({ name, email, password: hashedPassword });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
};
