const { authenticateUser } = require('../models/auth.model.js')

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    authenticateUser(email, password)
        .then((tokens) => {
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
            res.status(200).send({ tokens });
        })
        .catch((err) => {
            console.log(err)
            next(err)
        });
}