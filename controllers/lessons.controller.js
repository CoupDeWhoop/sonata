const { fetchAllLessons, fetchUserLessons, fetchUserLessonNotes, insertLesson, insertLessonNote } = require('../models/lessons.model')

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
    const { lesson_id } = req.params;
    fetchUserLessonNotes(user_id, lesson_id)
        .then((notes) => {
            res.status(200).send({notes})
        })
        .catch((err) => next(err))
}

exports.postLesson = (req, res, next) => {
    const { user_id, duration, timestamp } = req.body; // should i be getting user from req.user?
    insertLesson(user_id, duration, timestamp)
        .then((lesson) => {
            res.status(201).send({ lesson })
        })
        .catch((err) => next(err))

}

exports.postLessonNote = (req, res, next) => {
    const { user_id } = req.user;
    const { notes, lesson_id } = req.body;

    fetchUserLessons(user_id, lesson_id) // checks lesson matches user
    .then(() => {
        return insertLessonNote(lesson_id, notes);
    })
    .then((note) => {
        res.status(201).send({ note });
    })
    .catch((err) => {
        next(err);
    });

}