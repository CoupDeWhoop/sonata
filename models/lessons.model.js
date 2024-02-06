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