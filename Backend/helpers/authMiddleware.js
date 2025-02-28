import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), "yourSecretKey"); // Replace with your actual secret key
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;
