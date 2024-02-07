const db = require('../db/connection')

exports.fetchAllLessons = () => {
    return db.query(
        'SELECT * FROM lessons;'
    )
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchUserLessons = (user_id) => {
    return db.query(
        'SELECT * FROM lessons WHERE lessons.user_id = $1;',
         [user_id]
    )
    .then(({rows}) => rows )
}

exports.fetchUserLessonNotes = (user_id) => {
    return db.query(`
        SELECT
        lesson_notes.note_id,
        lesson_notes.notes,
        lesson_notes.lesson_id,
        lessons.lesson_date,
        lessons.lesson_time,
        lessons.duration
        FROM lesson_notes
        INNER JOIN lessons
        ON lesson_notes.lesson_id = lessons.lesson_id
        WHERE lessons.user_id = $1
        `, [user_id]
    )
    .then(({rows}) => rows)
}