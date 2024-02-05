const db = require('../db/connection.js');
const bcrypt = require('bcrypt');
const { jwtTokens } = require('../utils/jwt-helpers.js')
const jwt = require('jsonwebtoken')

exports.authenticateUser = (email, password) => {
    let user;

    return db
        .query(`
            SELECT * FROM users WHERE user_email = $1
        `, [email])
        .then(({ rows: users }) => {
            if(users.length === 0) return Promise.reject({status: 401, msg: "Email is incorrect"})
            user = users[0];
            return bcrypt.compare(password, user.user_password)
        })
        .then((validPassword) => {
            if(!validPassword) return Promise.reject({status: 401, msg: "Incorrect Password"});
            // JWT
            return jwtTokens(user)
        })
}

exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            reject({status: 401, msg: 'Null refresh token'});
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedUser) => {
            console.log("verify in model")
            if(err) {
                reject({status: 403, error: err.message});
            } else {
                let tokens = jwtTokens(decodedUser); //renews tokens
                resolve(tokens);
            }

        })
    })
}


