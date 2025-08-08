export const successResponse = (res: any, data: any, message = 'successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: any, message = 'Failed', statusCode = 500, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};