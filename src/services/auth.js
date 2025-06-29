import createHttpError from "http-errors";
import { UsersCollection } from "../models/user.js";
import bcrypt from 'bcrypt';
import { SessionCollection } from "../models/session.js";
import { createSession } from "../helpers/helpers.js";


export const registerUser = async (payload) => {
    const existingUser =await UsersCollection.findOne({email: payload.email});
    if(existingUser) {
        throw createHttpError(409, 'Email in use');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await UsersCollection.create({...payload, password: hashedPassword,});

    return user;
};
export const loginUser = async (payload) => {
      const user =await UsersCollection.findOne({email: payload.email});
      if(!user) {
        throw createHttpError(401, 'User not found' );
      }
       const arePasswordsEqual = await bcrypt.compare(
            payload.password,
            user.password,
        );
        if(!arePasswordsEqual){
            throw createHttpError(401, 'User login and password does not match');
        }
       await SessionCollection.findOneAndDelete({userId: user._id});

       const sesssion = await SessionCollection.create({
        ...createSession(),
        userId: user._id,
       })
        return sesssion;
};
export const logoutUser = async (sesssionId, sessionToken ) => {
    await SessionCollection.findOneAndDelete({
        _id: sesssionId,
         resreshToken: sessionToken});
};
export const refreshSession = async (sesssionId, refreshToken) => {
    const session = await SessionCollection.findOne({
        _id: sesssionId,
        refreshToken: refreshToken,
    });
    if(!session) {
        throw createHttpError(401, 'Session not found');
    }
    if(session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Session expired');
    }
    await SessionCollection.findByIdAndDelete(sesssionId);
    
       const newSesssion = await SessionCollection.create({
       ...createSession(),
        userId: session.userId,

       })
        return newSesssion;
};

