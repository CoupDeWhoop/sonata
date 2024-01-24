const db = require('./connection.js');
const format = require('pg');


const seed = ({ lessonsData,
        lessonNotesData,
        practiceData,
        practiceNotesData
    }) => {
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
                    lesson_date DATE,
                    lesson_time TIME,
                    duration INTERVAL
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE lesson_notes (
                    lesson_id INT REFERENCES lessons(id),
                    note_number SERIAL,
                    notes VARCHAR
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practises (
                    id SERIAL PRIMARY KEY,
                    practice_date DATE,
                    practice_time TIME,
                    duration INTERVAL
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practise_notes (
                    practice_id INT REFERENCES practises(id),
                    note_number SERIAL,
                    notes VARCHAR
                );
            `)
        })
};

module.exports = seed;