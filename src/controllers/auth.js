import { setupSessioncookies } from "../helpers/helpers.js";
import { logoutUser, refreshSession, registerUser } from "../services/auth.js"; 
import { loginUser } from "../services/auth.js";

export const registerUserController = async (req, res) => {
 const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
 const session = await loginUser(req.body);
setupSessioncookies(session, res);
res.clearCookie('sessionToken');
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken: session.accessToken },
  });
};
export const logoutUserController = async (req, res) => {
    const {sessionId, sessionToken } = req.cookies;

    await logoutUser(sessionId, sessionToken);
    res.clearCookie('sessionToken');
    res.clearCookie('sessionId');
    res.status(204).send();
};
export const refreshSessionController = async (req, res) => {
    const{refreshToken, sessionId} = req.cookies;
    if (!refreshToken || !sessionId) {
      return res.status(401).json({ status: 401, message: 'No refreshToken or sessionId in cookies' });
    }
    const session = await refreshSession(sessionId, refreshToken);
    setupSessioncookies(session, res);
    res.json({
        status: 200,
        message: 'Succesfully refreshed a session',
        data: {
            accessToken: session.accessToken,
        },
    });
};
