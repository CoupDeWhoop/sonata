const { fetchUserPractises, fetchUserPracticeNotes, insertPractice } = require('../models/practises.model.js')

exports.getUserPractises = (req, res, next) => {
    const { user_id } = req.user;

    fetchUserPractises(user_id)
        .then((practises) => {
            res.status(200).send({ practises })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUserPracticeNotes = (req, res, next) => {
    const { user_id } = req.user;
    const { practice_id } = req.params;
    fetchUserPracticeNotes(user_id, practice_id)
        .then((notes) => {
            res.status(200).send({ notes })
        })
        .catch((err) => {
            next(err)
        })
}

exports.postPractice = (req, res, next) => {
    const { user_id } = req.user;
    const { timestamp, duration } = req.body;
    insertPractice(user_id, timestamp, duration)
        .then((note) => {
            res.status(201).send({ note })
        })
        .catch((err) => next(err))
}
