import createHttpError from "http-errors";
import { SessionCollection } from "../models/session.js";
import { UsersCollection } from "../models/user.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        return next(createHttpError(401, 'Access token is missing')) ;
    }
      const [bearer, token] = authHeader.split(' ');
if (bearer !== 'Bearer' || !token) {
 return next (createHttpError(401, 'Invalid authorization format'));
}
    const session = await SessionCollection.findOne({accessToken: token});
    if(!session) {
        return next(createHttpError(401, 'Session not found')) ;
    }

    if(session.accessTokenValidUntil < new Date()) {
        return next(createHttpError( 401, 'Access token expired')) ;
    }
    const user = await UsersCollection.findById(session. userId);
    if(!user){
        return next(createHttpError(401, 'User not found'));
    }
    req.user = {
  _id: user._id,
  email: user.email,
};
    next();
    
};