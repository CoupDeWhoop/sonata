const db = require("../db/connection");

exports.fetchAllLessons = () => {
  return db.query("SELECT * FROM lessons;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserLessons = (user_id) => {
  return db
    .query(
      `
        SELECT * FROM lessons 
        WHERE lessons.user_id = $1
    `,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchLessonByLessonId = (user_id, lesson_id) => {
  return db
    .query(
      `
        SELECT * FROM lessons 
        WHERE lessons.lesson_id = $1
    `,
      [lesson_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Lesson not found" });
      if (rows[0].user_id !== user_id)
        return Promise.reject({ status: 403, msg: "Forbidden" });
      return rows[0];
    });
};

exports.fetchUserLessonsAndNotes = (user_id, lesson_id) => {
  const queryValues = [user_id];
  let queryStr = `
    SELECT
    lessons.lesson_id,
    lessons.lesson_timestamp,
    lessons.lesson_title,
    lessons.duration,
    notes.note_id,
    notes.note_content,
    notes.learning_focus
    FROM lessons
    LEFT JOIN notes
    ON lessons.lesson_id = notes.lesson_id
    WHERE lessons.user_id = $1`;

  if (lesson_id) {
    queryStr += " AND notes.lesson_id = $2";
    queryValues.push(lesson_id);
  }

  queryStr += " ORDER BY lessons.lesson_timestamp DESC;";
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0 && lesson_id) {
      return Promise.reject({ status: 404, msg: "Lesson not found" });
    } else if (rows.length === 0) {
      return rows;
    }

    const lessonsWithNotesArray = rows.reduce((acc, row) => {
      const {
        lesson_id,
        lesson_timestamp,
        duration,
        note_id,
        note_content,
        learning_focus,
      } = row;
      const existingLesson = acc.find(
        (lesson) => lesson.lesson_id === lesson_id
      );
      if (existingLesson) {
        if (note_id !== undefined) {
          existingLesson.notes.push({ note_id, note_content, learning_focus });
        }
      } else {
        acc.push({
          lesson_id,
          lesson_timestamp,
          duration,
          notes: note_id ? [{ note_id, note_content, learning_focus }] : [],
        });
      }
      return acc;
    }, []);

    return lessonsWithNotesArray;
  });
};

exports.insertLesson = (user_id, duration = 20, timestamp) => {
  return db
    .query(
      `
        INSERT INTO lessons
        (user_id, duration, lesson_timestamp)
        VALUES
        ($1, $2, $3)
        RETURNING *
    `,
      [user_id, duration, timestamp]
    )
    .then(({ rows }) => rows[0]);
};

exports.insertLessonNote = (lesson_id, learning_focus, note_content) => {
  return db
    .query(
      `
        INSERT INTO notes
        (lesson_id, learning_focus, note_content)
        VALUES
        ($1, $2, $3)
        RETURNING *
    `,
      [lesson_id, learning_focus, note_content]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateLessonNote = (note_id, note_content) => {
  return db
    .query(
      `
        UPDATE notes
        SET note_content = $1
        WHERE note_id = $2
        RETURNING *
    `,
      [note_content, note_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeLessonNoteByLessonId = (lesson_id) => {
  return db.query(
    `
        DELETE FROM notes
        WHERE lesson_id = $1
    `,
    [lesson_id]
  );
};

exports.removeLessonByLessonId = (lesson_id) => {
  return db
    .query(
      `
        DELETE FROM lessons
        WHERE lesson_id = $1
    `,
      [lesson_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Lesson not found" });
      }
    });
};
