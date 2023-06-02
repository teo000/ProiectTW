const {User} = require('../models/UserModel');
const databaseConnection = require('../database/databaseConnection.js');
const {AuthenticationModel} = require('../models/AuthenticationModel');

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
};

const getUser = (username) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM users where username = $1', [username],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}

const addUser = async (userData) => {
    return new Promise((resolve, reject) => {
        const { username, email,passwordHash,salt } = userData;
        databaseConnection.pool.query('INSERT INTO users (username, email,passwordHash,salt ) VALUES ($1, $2, $3,$4) RETURNING *',
            [username,email, passwordHash,salt], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

module.exports = {
    getAllUsers,
    getUser,
    addUser
}