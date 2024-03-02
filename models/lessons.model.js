const db = require('../db/connection')

exports.fetchAllLessons = () => {
    return db.query(
        'SELECT * FROM lessons;'
    )
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchUserLessons = (user_id, lesson_id) => {
    const queryValues = [user_id]
    let queryStr = 'SELECT * FROM lessons WHERE lessons.user_id = $1'

    if (lesson_id) {
        queryStr += ' AND lessons.lesson_id = $2';
        queryValues.push(lesson_id);
    }

    return db.query(
        queryStr, queryValues
    )
    .then(({rows}) => {
        if (lesson_id && rows.length === 0) {
            return Promise.reject({status: 403, msg: "Unauthorised"})
        } else {
            return rows;
        }
    } )
}

exports.fetchUserLessonsAndNotes = (user_id, lesson_id) => {
    const queryValues = [user_id]
    let queryStr = `
    SELECT
    lessons.lesson_id,
    lessons.lesson_timestamp,
    lessons.duration,
    lesson_notes.note_id,
    lesson_notes.notes
    FROM lessons
    LEFT JOIN lesson_notes
    ON lessons.lesson_id = lesson_notes.lesson_id
    WHERE lessons.user_id = $1`

    if (lesson_id) {
        queryStr += ' AND lesson_notes.lesson_id = $2';
        queryValues.push(lesson_id)
    }

    return db.query(queryStr, queryValues)
    .then(({rows}) => {
        if(rows.length === 0) return Promise.reject({status: 404, msg: 'Lesson not found'})

        const lessonsWithNotesArray = rows.reduce((acc, row) => {
            const {lesson_id, lesson_timestamp, duration, note_id, notes } = row;
            const existingLesson = acc.find((lesson) => lesson.lesson_id === lesson_id);
            if (existingLesson) {
                if (note_id !== undefined) {
                    existingLesson.notes.push({ note_id, notes });
                }
            } else {
                acc.push({
                    lesson_id,
                    lesson_timestamp,
                    duration,
                    notes: note_id ? [{ note_id, notes }] : []
                })
            }
            return acc;
        }, []);

        return lessonsWithNotesArray;
    })
}

exports.insertLesson = (user_id, duration = 20, timestamp) => {
    return db.query(
        `
        INSERT INTO lessons
        (user_id, duration, lesson_timestamp)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `, [user_id, duration, timestamp])
    .then(({ rows }) => rows[0])
}

exports.insertLessonNote = (lesson_id, notes) => {
    return db.query(`
        INSERT INTO lesson_notes
        (lesson_id, notes)
        VALUES
        ($1, $2)
        RETURNING *
        `, [lesson_id, notes])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.updateLessonNote = (note_id, notes) => {
    return db.query(`
        UPDATE lesson_notes
        SET notes = $1
        WHERE note_id = $2
        RETURNING *
        `, [notes, note_id])
    .then(({ rows }) => {
        return rows[0]
    })
}