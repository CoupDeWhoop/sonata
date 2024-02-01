const db = require('../db/connection.js')

exports.authenticateUser = (email, password) => {
    return db
        .query(`
            SELECT * FROM users WHERE user_email = $1
        `, [email])
        .then(({ rows: users }) => {
            if(users.length === 0) return Promise.reject({status: 401, msg : "Email is incorrect"})
    })
}