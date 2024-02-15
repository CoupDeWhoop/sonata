const db = require('../db/connection.js')

exports.fetchUserPractises = (user_id) => {
    console.log('hello')
    return db.query(
        'SELECT * FROM practises WHERE practises.user_id = $1;',
         [user_id]
    )
    .then(({rows}) => rows )
}