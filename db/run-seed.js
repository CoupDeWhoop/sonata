const seed = require("./seed.js");
const db = require("./connection.js");
const devData = require("./data.js");

seed(devData).then(() => {
  console.log("Seeding complete!");
  return db.end();
});
