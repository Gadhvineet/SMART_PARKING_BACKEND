const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Handle Bearer token
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // { id, role }

      // ✅ ROLE CHECK (ONLY IF PROVIDED)
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;