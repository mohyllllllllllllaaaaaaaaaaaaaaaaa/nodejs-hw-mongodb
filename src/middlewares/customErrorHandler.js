export const customErrorHandler = (err, req, res, next) => {
    if(err.status === 404){
        return res.status(404).json({
            status: 404,
            message: err.message,
            data: null,
        });
    }
    next(err);
}