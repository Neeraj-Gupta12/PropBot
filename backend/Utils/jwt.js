import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


const checkLogin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied, Login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { generateToken, checkLogin };
