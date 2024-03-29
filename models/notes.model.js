const db = require("../db/connection");

exports.fetchAllNotes = (user_id) => {
  return db
    .query(
      `
            SELECT
              notes.practice_id,
              notes.lesson_id,
              notes.note_id,
              notes.note_content,
              notes.learning_focus,
              practises.practice_timestamp,
              lessons.lesson_timestamp
            FROM notes
            LEFT JOIN practises ON notes.practice_id = practises.practice_id
            LEFT JOIN lessons ON notes.lesson_id = lessons.lesson_id
            WHERE (practises.user_id = $1 OR lessons.user_id = $1)
            ORDER BY COALESCE(practises.practice_timestamp, lessons.lesson_timestamp) DESC;
        `,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
