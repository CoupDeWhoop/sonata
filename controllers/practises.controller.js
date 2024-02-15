const { fetchUserPractises } = require('../models/practises.model.js')

exports.getUserPractises = (req, res, next) => {
    const { user_id } = req.user;

    fetchUserPractises(user_id)
        .then((practises) => {
            console.log(practises)
            res.status(200).send({ practises })
        })
        .catch((err) => {
            next(err)
        })
}
