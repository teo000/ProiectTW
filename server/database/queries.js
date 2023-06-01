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

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const { username, email,passwordHash,salt } = user;
        pool.query('INSERT INTO users (username, email,passwordHash,salt ) VALUES ($1, $2, $3,$4) RETURNING *',
            [username,email, passwordHash,salt], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
};

module.exports = {
    getUsers,
    getUserByUsername,
    createUser
};
