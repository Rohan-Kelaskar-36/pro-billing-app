import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET;

  return jwt.sign({ id, role }, secret, {
    expiresIn: "7d",
  });
};
