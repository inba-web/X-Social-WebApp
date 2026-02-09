import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 1000,
    secure:false,
    httpOnly: true, // xss attacks
    sameSite: "strict", //CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateToken;
