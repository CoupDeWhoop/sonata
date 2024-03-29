const lessonRouter = require("express").Router();
const {
  getAllLessons,
  getUserLessons,
  getLessonByLessonId,
  getUserLessonsAndNotes,
  postLesson,
  postLessonNote,
  patchLessonNote,
  deleteLessonByLessonId,
} = require("../controllers/lessons.controller.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth.middleware.js");

lessonRouter.get("/admin", authenticateToken, requireAdmin, getAllLessons);

//lessonRouter.get('/:lesson_id', authenticateToken, getLessonByLessonId)
lessonRouter.delete("/:lesson_id", authenticateToken, deleteLessonByLessonId);

lessonRouter
  .route("/:lesson_id/notes")
  .get(authenticateToken, getUserLessonsAndNotes)
  .post(authenticateToken, postLessonNote);

lessonRouter
  .route("/notes")
  .get(authenticateToken, getUserLessonsAndNotes)
  .patch(authenticateToken, patchLessonNote);

lessonRouter
  .route("/")
  .get(authenticateToken, getUserLessons)
  .post(authenticateToken, postLesson);

module.exports = lessonRouter;
