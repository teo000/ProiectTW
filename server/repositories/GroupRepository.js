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

module.exports = {
    getMyGroups
}