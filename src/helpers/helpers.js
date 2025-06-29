import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/contacts.js";
import crypto from 'crypto';


export const setupSessioncookies = (session, res) => {
 res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
 });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
 });
};
export const createSession = () => ({
 accessToken: crypto.randomBytes(30).toString('base64'),
 refreshToken: crypto.randomBytes(30).toString('base64'),
accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
});