const seed = require('./seed.js');
const db = require('./connection.js')

seed().then(() => {
    console.log('Seeding complete!');
    return db.end();
})