const db = require('./connection.js');
const format = require('pg-format');
const { generateUserUUIDs, createRef, replaceKeyWithId, hashPasswords } = require('../utils/seed-utils.js');

let userIdLookup = {};

const seed = ({ usersData,  
        lessonsData,
        lessonNotesData,
        practisesData,
        practiceNotesData
    }) => {
    return db
        // drop in reverse order
        .query('DROP TABLE IF EXISTS practice_notes;')
        .then(() => db.query('DROP TABLE IF EXISTS practises;'))
        .then(() => db.query('DROP TABLE IF EXISTS lesson_notes;'))
        .then(() => db.query('DROP TABLE IF EXISTS lessons;'))
        .then(() => db.query('DROP TABLE IF EXISTS users'))
        .then(() => {
            return db.query(`
                CREATE TABLE users (
                    user_id uuid PRIMARY KEY NOT NULL,
                    user_name VARCHAR NOT NULL,
                    user_email VARCHAR(255) NOT NULL UNIQUE,
                    user_password VARCHAR(255) NOT NULL,
                    instrument VARCHAR
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE lessons (
                    lesson_id SERIAL PRIMARY KEY,
                    user_id uuid REFERENCES users(user_id) NOT NULL,
                    lesson_timestamp TIMESTAMP NOT NULL,
                    duration INT DEFAULT 20
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE lesson_notes (
                    note_id SERIAL PRIMARY KEY,
                    lesson_id INT REFERENCES lessons(lesson_id),
                    notes VARCHAR
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practises (
                    practice_id SERIAL PRIMARY KEY,
                    user_id uuid REFERENCES users(user_id),
                    practice_timestamp TIMESTAMP,
                    duration INT DEFAULT 5
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practice_notes (
                    note_id SERIAL PRIMARY KEY,
                    practice_id INT REFERENCES practises(practice_id),
                    notes VARCHAR
                );
            `)
        })
        // then hydrate? the tables
        .then(() => {
            const usersWithAddedUUIDs = generateUserUUIDs(usersData);
            return hashPasswords(usersWithAddedUUIDs)
        })
        .then((usersWithHashedPasswords) => {
            const insertUsersQueryStr = format(
                `
                INSERT INTO users (user_id, user_name, user_email, user_password, instrument) 
                VALUES %L RETURNING *;
                `,
                //convert array of objects to array of simple user-data arrays
                usersWithHashedPasswords.map(({ user_id, name, email, password, instrument }) => {
                    return [user_id, name, email, password, instrument];
                })
            )
            return db.query(insertUsersQueryStr);
        })
        .then(({ rows: userRows }) => {
            //rows is an array of User objects
            userIdLookup = createRef(userRows, 'user_name', 'user_id'); // updates userIDLookup globally
            const formattedLessons = replaceKeyWithId(lessonsData, userIdLookup, "user_name")
                .map((lesson) => {
                    return [lesson.user_id, lesson.lesson_timestamp, lesson.length];
                });

            const insertLessonsQueryString = format(
                `
                INSERT INTO lessons
                (user_id, lesson_timestamp, duration)
                VALUES
                %L
                RETURNING *;
                `,
                formattedLessons
            );

            // deal with db
            return db.query(insertLessonsQueryString);
        })
        .then(() => {
            const formattedLessonNotes = lessonNotesData.map((note) => {
                return [note.lesson_id, note.notes]
            })
            const insertNotesQueryString = format(
                `
                INSERT INTO lesson_notes
                (lesson_id, notes)
                VALUES
                %L
                RETURNING *;
                `,
                formattedLessonNotes
            );

            return db.query(insertNotesQueryString)
        })
        .then(() => {
            const formattedPractises = replaceKeyWithId(practisesData, userIdLookup, "name").map((practice) => {
                return [practice.user_id, practice.practice_timestamp, practice.length]
            })
            const insertPracticesQueryString = format(
                `
                INSERT INTO practises
                (user_id, practice_timestamp, duration)
                VALUES
                %L
                RETURNING *;
                `,
                formattedPractises
            );

            return db.query(insertPracticesQueryString);
        })
        .then(() => {
            const formattedPracticeNotes = practiceNotesData.map((practice) => {
                return [practice.practice_id, practice.notes]
            })
            const insertQueryString = format(
                `
                INSERT INTO practice_notes
                (practice_id, notes)
                VALUES
                %L
                RETURNING *;
                `,
                formattedPracticeNotes
            );

            return db.query(insertQueryString)
        })
        
};

module.exports = seed;