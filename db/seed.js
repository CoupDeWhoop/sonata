const db = require("./connection.js");
const format = require("pg-format");
const {
  generateUserUUIDs,
  createRef,
  replaceKeyWithId,
  hashPasswords,
} = require("../utils/seed-utils.js");

let userIdLookup = {};

const seed = ({ usersData, lessonsData, practisesData, notesData }) => {
  return (
    db
      // drop in reverse order
      .query("DROP TABLE IF EXISTS notes;")
      .then(() => db.query("DROP TABLE IF EXISTS lesson_notes"))
      .then(() => db.query("DROP TABLE IF EXISTS practice_notes;"))
      .then(() => db.query("DROP TABLE IF EXISTS practises;"))
      .then(() => db.query("DROP TABLE IF EXISTS lessons;"))
      .then(() => db.query("DROP TABLE IF EXISTS users"))
      .then(() => {
        return db.query(`
                CREATE TABLE users (
                    user_id uuid PRIMARY KEY NOT NULL,
                    user_name VARCHAR NOT NULL,
                    user_email VARCHAR(255) NOT NULL UNIQUE,
                    user_password VARCHAR(255) NOT NULL,
                    instrument VARCHAR
                );
            `);
      })
      .then(() => {
        return db.query(`
                CREATE TABLE lessons (
                    lesson_id SERIAL PRIMARY KEY,
                    user_id uuid REFERENCES users(user_id) NOT NULL,
                    lesson_title VARCHAR DEFAULT 'Lesson',
                    lesson_timestamp TIMESTAMP NOT NULL,
                    duration INT DEFAULT 20
                );
            `);
      })
      .then(() => {
        return db.query(`
                CREATE TABLE practises (
                    practice_id SERIAL PRIMARY KEY,
                    practice_title VARCHAR DEFAULT 'Practice',
                    user_id uuid REFERENCES users(user_id),
                    practice_timestamp TIMESTAMP NOT NULL,
                    duration INT DEFAULT 5
                );
            `);
      })
      .then(() => {
        return db.query(`
                CREATE TABLE notes (
                    note_id SERIAL PRIMARY KEY,
                    practice_id INT REFERENCES practises(practice_id),
                    lesson_id INT REFERENCES lessons(lesson_id),
                    learning_focus VARCHAR,
                    note_content VARCHAR
                );
            `);
      })
      // then hydrate? the tables
      .then(() => {
        const usersWithAddedUUIDs = generateUserUUIDs(usersData);
        return hashPasswords(usersWithAddedUUIDs);
      })
      .then((usersWithHashedPasswords) => {
        const insertUsersQueryStr = format(
          `
                INSERT INTO users (user_id, user_name, user_email, user_password, instrument) 
                VALUES %L RETURNING *;
                `,
          //convert array of objects to array of simple user-data arrays
          usersWithHashedPasswords.map(
            ({ user_id, name, email, password, instrument }) => {
              return [user_id, name, email, password, instrument];
            }
          )
        );
        return db.query(insertUsersQueryStr);
      })
      .then(({ rows: userRows }) => {
        //rows is an array of User objects
        userIdLookup = createRef(userRows, "user_name", "user_id"); // updates userIDLookup globally
        const formattedLessons = replaceKeyWithId(
          lessonsData,
          userIdLookup,
          "user_name"
        ).map((lesson) => {
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
        const formattedPractises = replaceKeyWithId(
          practisesData,
          userIdLookup,
          "name"
        ).map((practice) => {
          return [
            practice.user_id,
            practice.practice_timestamp,
            practice.length,
          ];
        });
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
        const formattedNotes = notesData.map((note) => {
          return [
            note.lesson_id,
            note.practice_id,
            note.note_content,
            note.learning_focus,
          ];
        });
        const insertNotesQueryString = format(
          `
                INSERT INTO notes
                (lesson_id, practice_id, note_content, learning_focus)
                VALUES
                %L
                RETURNING *;
                `,
          formattedNotes
        );

        return db.query(insertNotesQueryString);
      })
  );
};

module.exports = seed;
