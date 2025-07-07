import createHttpError from "http-errors";
import { UsersCollection } from "../models/user.js";
import bcrypt from 'bcrypt';
import { SessionCollection } from "../models/session.js";
import { createSession } from "../helpers/helpers.js";
import { TEMPLATE_DIR } from "../constants/path.js"; 
import handlebars from 'handlebars';
import { sendEmail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { getEnvVar } from "../utils/getEnvVar.js";
import { ENV } from "../constants/contacts.js";


export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await UsersCollection.create({ ...payload, password: hashedPassword });
  return user;
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const arePasswordsEqual = await bcrypt.compare(payload.password, user.password);
  if (!arePasswordsEqual) {
    throw createHttpError(401, 'User login and password does not match');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const session = await SessionCollection.create({
    ...createSession(),
    userId: user._id,
  });

  return session;
};

export const logoutUser = async (sessionId, sessionToken) => {
  await SessionCollection.findOneAndDelete({
    _id: sessionId,
    resreshToken: sessionToken,
  });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session expired');
  }

  await SessionCollection.findByIdAndDelete(sessionId);

  const newSession = await SessionCollection.create({
    ...createSession(),
    userId: session.userId,
  });

  return newSession;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const jwtSecret = getEnvVar(ENV.JWT_SECRET);
  const resetToken = jwt.sign(
    { sub: user._id, email },
    jwtSecret,
    { expiresIn: '5m' }
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATE_DIR,
    'reset-password-email.html'
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf8');
  const resetLink = `${getEnvVar(ENV.APP_DOMAIN)}/reset-password?token=${resetToken}`;

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name || 'User',
    link: resetLink,
  });

  await sendEmail({
    from: getEnvVar(ENV.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar(ENV.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, 'Invalid or expired token');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword }
  );

  await SessionCollection.deleteMany({ userId: user._id });
};

