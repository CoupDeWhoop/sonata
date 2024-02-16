const db = require('../db/connection.js')

exports.fetchUserPractises = (user_id) => {
    return db.query(
        'SELECT * FROM practises WHERE practises.user_id = $1;',
         [user_id]
    )
    .then(({rows}) => rows )
}

exports.fetchUserPracticeNotes = (user_id, practice_id) => {
    const queryValues = [user_id];
    let queryStr = `
        SELECT
        practice_notes.practice_id,
        practice_notes.note_id,
        practice_notes.notes,
        practises.practice_date,
        practises.practice_time
        FROM practises
        INNER JOIN practice_notes
        ON practises.practice_id = practice_notes.practice_id
        WHERE practises.user_id = $1
    `
    if (practice_id) {
        queryStr += ' AND practice_notes.practice_id = $2';
        queryValues.push(practice_id)
    }

    return db.query(queryStr , queryValues)
        .then(({rows}) => {
            if(rows.length === 0) return Promise.reject({status: 404, msg: 'Not found'})
            return rows
        })
}
