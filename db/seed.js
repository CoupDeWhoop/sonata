const db = require('./connection.js')

const seed = () => {
    return db
        // drop in reverse order
        .query('DROP TABLE IF EXISTS practise_notes;')
        .then(() => {
            return db.query('DROP TABLE IF EXISTS practises;')
        })
        .then(() => {
            return db.query('DROP TABLE IF EXISTS lesson_notes;')
        })
        .then(() => {
            return db.query('DROP TABLE IF EXISTS lessons;')
        })
        // create tables
        .then(() => {
            return db.query(`
                CREATE TABLE lessons (
                    id SERIAL PRIMARY KEY,
                    time TIMESTAMP,
                    duration INTERVAL
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE lesson_notes (
                    lesson_id INT REFERENCES lessons(id),
                    notes VARCHAR
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practises (
                    id SERIAL PRIMARY KEY,
                    time TIMESTAMP,
                    duration INTERVAL
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practise_notes (
                    lesson_id INT REFERENCES practises(id),
                    notes VARCHAR
                );
            `)
        })
};

module.exports = seed;