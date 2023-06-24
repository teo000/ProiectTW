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
    console.log(userData);
    return new Promise((resolve, reject) => {
        const { username, email,passwordHash,salt, isAdmin} = userData;
        console.log(username, email,passwordHash,salt);
        databaseConnection.pool.query('INSERT INTO users (username, email,passwordHash,salt, is_admin ) VALUES ($1, $2, $3,$4, $5) RETURNING *',
            [username,email, passwordHash,salt, isAdmin], (error, results) => {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

const addResetPasswordCode = (id, code) =>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`update users set reset_password_code = $1 where id = $2`,
            [code,id], (error, results) => {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}
const deleteUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('delete from users where username=$1 returning  *',
            [username],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

//instead of deleting it sets the username to BookReviewerUser (like with facebook user)
const deleteUser = async(id) =>{

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('update users set username = $1 where id = $2 returning *',
            ['BookReviewerUser',id], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
}

const resetPassword = async(userData) =>{
    console.log(userData);
    return new Promise((resolve, reject) => {
        const { username,passwordHash,salt} = userData;
        databaseConnection.pool.query(`update users set passwordhash = $2, salt = $3, reset_password_code = null where username = $1 returning *;`,
            [username,passwordHash,salt], (error, results) => {
                if (error) {
                    console.log(error)
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
    addUser,
    deleteUserByUsername,
    resetPassword,
    deleteUser,
    addResetPasswordCode,
}