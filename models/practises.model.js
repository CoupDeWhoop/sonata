const db = require("../db/connection.js");

exports.fetchUserPractises = (user_id, practice_id) => {
  const queryValues = [user_id];
  let queryStr = "SELECT * FROM practises WHERE practises.user_id = $1";

  if (practice_id) {
    queryStr += " AND practises.practice_id = $2";
    queryValues.push(practice_id);
  }
  queryStr += " ORDER BY practises.practice_timestamp ASC";

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchPracticeByPracticeId = (user_id, practice_id) => {
  return db
    .query(
      `
        SELECT * FROM practises 
        WHERE practises.practice_id = $1
    `,
      [practice_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Practice not found" });
      }
      if (rows[0].user_id !== user_id)
        return Promise.reject({ status: 403, msg: "Forbidden" });
      return rows[0];
    });
};

exports.fetchUserPracticeNotes = (user_id, practice_id) => {
  const queryValues = [user_id];
  let queryStr = `
        SELECT
        notes.practice_id,
        notes.note_id,
        notes.note_content,
        notes.learning_focus,
        practises.practice_timestamp
        FROM practises
        INNER JOIN notes
        ON practises.practice_id = notes.practice_id
        WHERE practises.user_id = $1
    `;
  if (practice_id) {
    queryStr += " AND notes.practice_id = $2";
    queryValues.push(practice_id);
  }
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "Not found" });
    return rows;
  });
};

exports.fetchPracticeNoteByNoteId = (note_id, practice_id = null) => {
  let query = `
        SELECT * FROM notes 
        WHERE notes.note_id = $1
    `;
  const params = [note_id];

  if (practice_id !== null) {
    query += ` AND notes.practice_id = $2`;
    params.push(practice_id);
  }

  return db.query(query, params).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "Note not found" });
    return rows[0];
  });
};

exports.insertPractice = (user_id, timestamp, duration) => {
  return db
    .query(
      `
        INSERT INTO practises
        (user_id, practice_timestamp, duration)
        VALUES
        ($1, $2, $3)
        RETURNING * `,
      [user_id, timestamp, duration]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updatePractice = (practice_id, timestamp, duration) => {
  let queryStr = "UPDATE practises SET";
  let paramIndex = 1;

  const values = [];

  if (timestamp) {
    queryStr += ` practice_timestamp = $${paramIndex}`;
    values.push(timestamp);
    paramIndex++;
  }

  if (duration) {
    if (values.length !== 0) queryStr += ",";
    queryStr += ` duration = $${paramIndex}`;
    values.push(duration);
    paramIndex++;
  }

  queryStr += ` WHERE practice_id = $${paramIndex} RETURNING *;`;
  values.push(practice_id);

  return db.query(queryStr, values).then(({ rows }) => rows[0]);
};

exports.insertPracticeNote = (practice_id, note_content, learning_focus) => {
  return db
    .query(
      `
        INSERT INTO notes
        (practice_id, note_content, learning_focus)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
      [practice_id, note_content, learning_focus]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updatePracticeNote = (note_id, updateFields) => {
  const { note_content, learning_focus } = updateFields;

  let queryStr = "UPDATE notes SET";
  let paramIndex = 1;

  const values = [];

  if (note_content) {
    queryStr += ` note_content = $${paramIndex}`;
    values.push(note_content);
    paramIndex++;
  }
  if (learning_focus) {
    if (values.length !== 0) queryStr += ",";
    queryStr += ` learning_focus = $${paramIndex}`;
    values.push(learning_focus);
    paramIndex++;
  }

  queryStr += ` WHERE note_id = $${paramIndex} RETURNING *`;

  values.push(note_id);
  return db.query(queryStr, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.removePracticeNoteByPracticeId = (practice_id) => {
  return db.query(
    `
        DELETE FROM notes
        WHERE practice_id = $1
    `,
    [practice_id]
  );
};

exports.removePracticeByPracticeId = (practice_id) => {
  return db
    .query(
      `
        DELETE from practises
        WHERE practice_id = $1

    `,
      [practice_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Practice not found" });
      }
    });
};
