const { fetchAllLessons } = require('../models/lessons.model')

exports.getLessons = (req, res, next) => {
    fetchAllLessons()
        .then((lessons) => {
            res.status(200).send({lessons})
        })
        .catch((err) => next(err));
}