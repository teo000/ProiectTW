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

const getUserById = (id) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM users where id = $1', [id],(error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows[0]);
        });
    });
}

const getUser = (username) => {
    console.log(`getUser`);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM users where username = $1', [username],(error, results) => {
            if (error) {
                reject(error);
            }
            console.log(results.rows[0]);
            resolve(results.rows[0]);
        });
    });
}

const addUser = async (userData) => {
    console.log(userData);
    return new Promise((resolve, reject) => {
        const { username, email,passwordHash,salt, isAdmin} = userData;
        console.log(username, email,passwordHash,salt);
        databaseConnection.pool.query('INSERT INTO users (username, email,passwordHash,salt, is_admin ) VALUES ($1, $2, $3,$4, $5) RETURNING *',
            [username,email, passwordHash,salt, isAdmin], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    getUser,
    addUser
}