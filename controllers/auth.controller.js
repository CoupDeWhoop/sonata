const {
  authenticateUser,
  verifyRefreshToken,
} = require("../models/auth.model.js");

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  authenticateUser(email, password)
    .then((tokens) => {
      res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true }); //sets cookie
      res.status(200).send({ tokens });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  verifyRefreshToken(refreshToken || token)
    .then((tokens) => {
      res.status(200).send({ tokens });
    })
    .catch((err) => {
      next(err);
    });
};
