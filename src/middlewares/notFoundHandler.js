import createHttpError from 'http-errors';

export const notFoundHandler = (err, req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};