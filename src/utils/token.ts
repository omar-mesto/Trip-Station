import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || 'accesssecret', {
    expiresIn: '150m',
  });
};
