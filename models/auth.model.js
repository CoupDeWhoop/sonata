const db = require('../db/connection.js');
const bcrypt = require('bcrypt');

exports.authenticateUser = (email, password) => {
    return db
        .query(`
            SELECT * FROM users WHERE user_email = $1
        `, [email])
        .then(({ rows: users }) => {
            if(users.length === 0) return Promise.reject({status: 401, msg : "Email is incorrect"})
            const user = users[0];
            return bcrypt.compare(password, user.user_password)
        })
        .then((validPassword) => {
            if(!validPassword) return Promise.reject({status: 401, msg: "Incorrect Password"})
        })
}