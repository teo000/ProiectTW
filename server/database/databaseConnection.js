const Pool = require('pg').Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "parola",
    database: "book_reviewer"
});


module.exports = {
    pool,
};
