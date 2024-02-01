const { authenticateUser } = require('../models/auth.model.js')


exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    authenticateUser(email, password)
        .then((user) => {
            res.status(200).send({user});
        })
        .catch((err) => {
            next(err)
        });
}