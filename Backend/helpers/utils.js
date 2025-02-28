const  jwt =require("jsonwebtoken")


 const generateToken = async (adminId, res) => {
  const token = jwt.sign({ adminId }, process.env.JwT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};

module.exports =generateToken ;