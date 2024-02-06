const { fetchAllLessons, fetchUserLessons } = require('../models/lessons.model')

exports.getAllLessons = (req, res, next) => {
    fetchAllLessons()
        .then((lessons) => {
            res.status(200).send({lessons})
        })
        .catch((err) => next(err));
}

exports.getLessons = (req, res, next) => {
    const { user_id } = req.user;
    fetchUserLessons(user_id)
        .then((lessons) => {
            res.status(200).send({lessons})
        })
        .catch((err) => next(err));
}