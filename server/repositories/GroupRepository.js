const databaseConnection = require('../database/databaseConnection.js');
const {getUser} = require("./UserRepository");

const getMyGroups = async(username) => {
    console.log("groupRepository: getMyGroups");

    const user = await getUser(username);
    console.log(user);

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT g.id, g.name, g.creator_id, g.book_id, g.invite_code, (g.creator_id = $1)::boolean AS is_owner , b.title, b.author, b.description, b.rating, b.coverimg FROM groups g NATURAL JOIN group_members gm JOIN books b on g.book_id = b.id where gm.member_id = $1',
            [user.id], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(user.id);
                const groups = results.rows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    creator_id: row.creator_id,
                    book_id: row.book_id,
                    invite_code: row.invite_code,
                    is_owner: (row.creator_id === user.id), // Access the is_owner field correctly
                    title: row.title,
                    author: row.author,
                    description: row.description,
                    rating: row.rating,
                    coverimg: row.coverimg,
                }));
                console.log(groups.is_owner);
                console.log(groups);
                resolve(groups);
            });
    });
};

const getGroupByName = async(name) => {
    console.log("groupRepository: getGroupByName");
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

const getGroupByInviteCode = async(inviteCode) => {
    console.log("groupRepository: getGroupByInviteCode");

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM groups g where g.invite_code = $1',
            [inviteCode], (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
////                if(results.rowCount === 0) ceva chestie
                resolve(results.rows[0]);
            });
    });
};

const joinGroup = async(username, groupId) => {
    console.log("groupRepository: joinGroup");

    const user = await getUser(username);
    console.log(user);

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('INSERT INTO group_members (group_id, member_id) VALUES ($1, $2);',
            [groupId, user.id], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
    });
};




module.exports = {
    getMyGroups,
    getGroupByName,
    joinGroup,
    getGroupByInviteCode
}