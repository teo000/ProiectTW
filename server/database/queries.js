const Pool = require('pg').Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "parola",
    database: "book_reviewer"
});

const getUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
};

const getUserByUsername = (usernameParameter) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users where username = $1', [usernameParameter],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
};


module.exports = {
    getUsers,
    getUserByUsername
};
