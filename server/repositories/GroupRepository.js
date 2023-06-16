const databaseConnection = require('../database/databaseConnection.js');
const {getUser} = require("./UserRepository");

const getMyGroups = async(username) => {
    console.log("groupRepository")

    const creator = await getUser(username);
    console.log(creator);

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM groups g NATURAL JOIN group_members gm JOIN books b on g.book_id = b.id where gm.member_id = $1',
            [creator.id], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
};

const getGroupByName = async(name) => {
    console.log("groupRepository")
    console.log(name);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM groups g JOIN books b on g.book_id = b.id where lower(g.name) = $1',
            [name], (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }

                resolve(results.rows[0]);

            });
    });
};

module.exports = {
    getMyGroups,
    getGroupByName
}