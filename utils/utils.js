const db = require('../db/connection')
const format = require('pg-format');


const checkExists = async (table, column, value) => {
  // %I is an identifier in pg-format
  const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: 'Resource not found' });
  }
};

const checkUserMatch = async(table1, table2, field, value, user_id) => {
  const queryStr = format(`
    SELECT * FROM %I 
    INNER JOIN %I
    ON %I.%I= %I.%I
    WHERE %I.%I = $1
    AND %I.user_id = $2;`, table1, table2, table1, field, table2, field, table1, field, table2)

    const dbOutput = await db.query(queryStr, [value, user_id])

    if(dbOutput.rows.length === 0) {
      return Promise.reject({ status: 403, msg: 'forbidden request'})
    }
}


module.exports = { checkExists, checkUserMatch };
