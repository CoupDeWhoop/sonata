const db = require('../db/connection.js');
const { generateUserUUIDs } = require('../utils/seed-utils.js')
const bcrypt = require('bcrypt');
 
exports.fetchAllUsers = () => {
    return db.query('SELECT * FROM users;').then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:200, msg: 'No users found'})
        } else {
            return rows;
        }
    })
}

exports.insertUser = (userObj) => {
    const addedUserId = generateUserUUIDs([userObj]); // this util expects an array of objects
    const { user_id, user_name, user_email, user_password, instrument } = addedUserId[0];

    return bcrypt.hash(user_password, 10).then((hashedPassword) => {
            return db.query(`
                INSERT INTO users 
                (user_id, user_name, user_email, user_password, instrument)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *;
                `, [user_id, user_name, user_email, hashedPassword, instrument])
        })
        .then(({rows}) => {
            return rows[0];
        })
}

