const db = require('../db/connection.js')

exports.fetchUserPractises = (user_id, practice_id) => {
    const queryValues = [user_id];
    let queryStr = 'SELECT * FROM practises WHERE practises.user_id = $1';
    
    if (practice_id) {
        queryStr += ' AND practises.practice_id = $2';
        queryValues.push(practice_id);
    }
    
    return db.query(queryStr, queryValues)
        .then(({rows}) => { 
            return rows;
        });
}

exports.fetchPracticeByPracticeId = (user_id, practice_id) => {
    return db.query(`
        SELECT * FROM practises 
        WHERE practises.practice_id = $1
    `, [practice_id])
    .then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({status: 404, msg: "Practice not found"})
        if (rows[0].user_id !== user_id) return Promise.reject({status: 403, msg: "Forbidden"})
        return rows[0];   
    })
}

exports.fetchUserPracticeNotes = (user_id, practice_id) => {
    const queryValues = [user_id];
    let queryStr = `
        SELECT
        practice_notes.practice_id,
        practice_notes.note_id,
        practice_notes.notes,
        practises.practice_timestamp
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

exports.insertPractice = (user_id, timestamp, duration) => {
    return db.query(`
        INSERT INTO practises
        (user_id, practice_timestamp, duration)
        VALUES
        ($1, $2, $3)
        RETURNING * `
        , [user_id, timestamp, duration])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.insertPracticeNote = (practice_id, notes) => {
    return db.query(`
        INSERT INTO practice_notes
        (practice_id, notes)
        VALUES
        ($1, $2)
        RETURNING *
        `, [practice_id, notes])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.updatePracticeNote = (note_id, notes) => {
    return db.query(`
        UPDATE practice_notes
        SET notes = $1
        WHERE note_id = $2
        RETURNING *
        `, [notes, note_id])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.removePracticeNoteByPracticeId = (practice_id) => {
    return db.query(`
        DELETE FROM practice_notes
        WHERE practice_id = $1
    `, [practice_id]);
}

exports.removePracticeByPracticeId = (practice_id) => {
    return db.query(`
        DELETE from practises
        WHERE practice_id = $1

    `, [practice_id])
    .then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Practice not found' });
        }
    });
}
