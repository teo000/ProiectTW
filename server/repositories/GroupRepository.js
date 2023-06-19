const databaseConnection = require('../database/databaseConnection.js');
const {getUser} = require("./UserRepository");

const getMyGroups = async(userId) => {
    console.log("groupRepository: getMyGroups");

    // const user = await getUser(username);
    // console.log(user);

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT g.id, g.name, g.creator_id, g.book_id, g.invite_code, (g.creator_id = $1)::boolean AS is_owner , b.title, b.author, b.description, b.rating, b.coverimg FROM groups g LEFT JOIN group_members gm on g.id = gm.group_id LEFT JOIN books b on g.book_id = b.id where gm.member_id = $1;',
            [userId], (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log(userId);
                if(results.rowCount === 0){
                    console.log('nu exista');
                    const groups = null;
                    resolve(groups);
                }
                else {
                    resolve(results.rows);
                }
            });
    });
};

const getGroupByName = async(name) => {
    console.log("groupRepository: getGroupByName");
    console.log(name);
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('SELECT * FROM groups g LEFT JOIN books b on g.book_id = b.id where lower(g.name) = $1',
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

const joinGroup = async(userId, groupId) => {
    console.log("groupRepository: joinGroup");

    // const user = await getUser(username);
    // console.log(user);

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('INSERT INTO group_members (group_id, member_id) VALUES ($1, $2);',
            [groupId, userId], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
    });
};

const insertGroup = async(name, creatorId) => {
    console.log("groupRepository: insertGroup");

    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('INSERT INTO groups (name, creator_id) VALUES ($1, $2) RETURNING *;',
            [name, creatorId], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows[0]);
            });
    });
};
module.exports = {
    getMyGroups,
    getGroupByName,
    joinGroup,
    getGroupByInviteCode,
    insertGroup
}