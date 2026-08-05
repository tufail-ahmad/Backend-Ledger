const userRepository = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/configs");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing or malformed" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authMiddlewareForSystemUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is missing or malformed" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findByIdWithSystemUser(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.systemUser) {
        return res
          .status(403)
          .json({ message: "Access denied: Not a system user" });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware, authMiddlewareForSystemUser };
