import jwt from "jsonwebtoken";
import User from "../Modals/userModal.js";

export const isAuthenticated = async (req, res, next) => {
  try {
  // Check for token in header or cookies
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token or token expired",
    });
  }
};
