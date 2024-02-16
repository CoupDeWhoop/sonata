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

exports.fetchUserLessonNotes = (user_id, lesson_id) => {
    const queryValues = [user_id]
    let queryStr = `
    SELECT
    lesson_notes.note_id,
    lesson_notes.notes,
    lesson_notes.lesson_id,
    lessons.lesson_timestamp,
    lessons.duration
    FROM lesson_notes
    INNER JOIN lessons
    ON lesson_notes.lesson_id = lessons.lesson_id
    WHERE lessons.user_id = $1`

    if (lesson_id) {
        queryStr += ' AND lesson_notes.lesson_id = $2';
        queryValues.push(lesson_id)
    }

    return db.query(queryStr, queryValues)
    .then(({rows}) => {
        if(rows.length === 0) return Promise.reject({status: 404, msg: 'Lesson not found'})
        return rows
    })
}