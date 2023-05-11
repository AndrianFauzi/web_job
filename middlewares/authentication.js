const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const decoded = verifyToken(access_token);
    const user = await User.findOne({
      where: { email: decoded.email },
    });
    if (!user) return next({ name: "Unauthorized" });
    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = authentication;
