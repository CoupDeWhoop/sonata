const db = require('../db/connection.js');
const bcrypt = require('bcrypt');

exports.fetchAllUsers = () => {
    return db.query(
        `
        SELECT * FROM users;
        `
    )
}