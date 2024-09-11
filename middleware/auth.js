const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED } = require("../errors/errors");
const { UnauthorizedError } = require("./error-handler");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization Required"));
    // return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  // let payload;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    // console.error(err);
    next(new UnauthorizedError("Authorization Required"));
    // return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  // req.user = payload;
  // return next();
};

module.exports = auth;
