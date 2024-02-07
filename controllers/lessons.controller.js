const { fetchAllLessons, fetchUserLessons, fetchUserLessonNotes } = require('../models/lessons.model')

exports.getAllLessons = (req, res, next) => {
    fetchAllLessons()
        .then((lessons) => {
            res.status(200).send({lessons})
        })
        .catch((err) => next(err));
}

exports.getUserLessons = (req, res, next) => {
    const { user_id } = req.user;
    fetchUserLessons(user_id)
        .then((lessons) => {
            res.status(200).send({lessons})
        })
        .catch((err) => next(err));
}

exports.getUserLessonNotes = (req, res, next) => {
    const { user_id } = req.user;
    fetchUserLessonNotes(user_id)
        .then((notes) => {
            console.log(notes)
            res.status(200).send({notes})
        })
        .catch((err) => next(err))
}