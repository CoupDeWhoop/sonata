const db = require('./connection.js');
const format = require('pg-format');


const seed = ({ lessonsData,
        lessonNotesData,
        practiceData,
        practiceNotesData
    }) => {
    return db
        // drop in reverse order
        .query('DROP TABLE IF EXISTS practice_notes;')
        .then(() => {
            return db.query('DROP TABLE IF EXISTS practices;')
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
                note_id SERIAL PRIMARY KEY,
                lesson_id INT REFERENCES lessons(id),
                notes VARCHAR
            );
        `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practices (
                    id SERIAL PRIMARY KEY,
                    practice_date DATE,
                    practice_time TIME,
                    duration INTERVAL
                );
            `)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE practice_notes (
                    note_id SERIAL PRIMARY KEY,
                    practice_id INT REFERENCES practices(id),
                    notes VARCHAR
                );
            `)
        })
        // then hydrate? the table
        .then(() => {
            //set up query string
            const formattedLessons = lessonsData.map((lesson) => {
                return [lesson.lesson_date, lesson.lesson_time, lesson.length]
            })
            const insertLessonsQueryString = format(
                `
                INSERT INTO lessons
                (lesson_date, lesson_time, duration)
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
            //set up query string
            const formattedPractices = practiceData.map((practice) => {
                return [practice.practice_date, practice.practice_time, practice.length]
            })
            const insertPracticesQueryString = format(
                `
                INSERT INTO practices
                (practice_date, practice_time, duration)
                VALUES
                %L
                RETURNING *;
                `,
                formattedPractices
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