const db = require('../db/connection')

exports.fetchAllLessons = () => {

    return db.query(
        `
        SELECT * 
        FROM LESSONS;
        `
    )
    .then(({ rows }) => {
        return rows
    })
}