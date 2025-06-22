import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const formattedErrors = err.details.map(detail => ({
      message: detail.message,
      path: detail.path,
      type: detail.type,
      context: detail.context,
    }));

    next(createHttpError(400, 'Bad Request Errors', {
      data: {
        message: 'Validation failed',
        errors: formattedErrors,
      }
    }));
  }
};

