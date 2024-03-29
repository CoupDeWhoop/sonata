const {
  fetchAllLessons,
  fetchUserLessons,
  fetchLessonByLessonId,
  fetchUserLessonsAndNotes,
  insertLesson,
  insertLessonNote,
  updateLessonNote,
  removeLessonNoteByLessonId,
  removeLessonByLessonId,
} = require("../models/lessons.model");
const { checkUserMatch } = require("../utils/utils");

exports.getAllLessons = (req, res, next) => {
  fetchAllLessons()
    .then((lessons) => {
      res.status(200).send({ lessons });
    })
    .catch((err) => next(err));
};

exports.getUserLessons = (req, res, next) => {
  const { user_id } = req.user;
  fetchUserLessons(user_id)
    .then((lessons) => {
      res.status(200).send({ lessons });
    })
    .catch((err) => next(err));
};

exports.getUserLessonsAndNotes = (req, res, next) => {
  const { user_id } = req.user;
  const { lesson_id } = req.params;
  fetchUserLessonsAndNotes(user_id, lesson_id)
    .then((lessons) => {
      res.status(200).send({ lessons });
    })
    .catch((err) => next(err));
};

exports.postLesson = (req, res, next) => {
  const { user_id } = req.user;
  const { duration, timestamp } = req.body;
  insertLesson(user_id, duration, timestamp)
    .then((lesson) => {
      res.status(201).send({ lesson });
    })
    .catch((err) => next(err));
};

exports.postLessonNote = (req, res, next) => {
  const { user_id } = req.user;
  const { lesson_id } = req.params;
  const { learning_focus, note_content } = req.body;

  const postLessonPromises = [
    fetchLessonByLessonId(user_id, lesson_id), // checks lesson matches user
    insertLessonNote(lesson_id, learning_focus, note_content),
  ];

  Promise.all(postLessonPromises)
    .then((promiseResolutions) => {
      res.status(201).send({ note: promiseResolutions[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchLessonNote = (req, res, next) => {
  const { user_id } = req.user;
  const { notes, note_id } = req.body;
  Promise.all([
    updateLessonNote(note_id, notes),
    checkUserMatch("notes", "lessons", "lesson_id", note_id, user_id),
  ])
    .then((results) => {
      res.status(200).send({ note: results[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteLessonByLessonId = (req, res, next) => {
  const { user_id } = req.user;
  const { lesson_id } = req.params;
  fetchLessonByLessonId(user_id, lesson_id)
    .then(() => {
      return removeLessonNoteByLessonId(lesson_id);
    })
    .then(() => {
      return removeLessonByLessonId(lesson_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
