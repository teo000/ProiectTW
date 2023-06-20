const databaseConnection = require("../database/databaseConnection");

const getBooksWithMostRatings = ()=>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select * from books order by numberofratings desc limit 5' ,
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}


const getBooksWithHighestRatings  = ()=>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query('select * from books order by rating desc limit 5' ,
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}

const getUsersWhoGaveMostReviews = ()=>{
    return new Promise((resolve, reject) => {
        databaseConnection.pool.query(`select username, userid, count(*)
                                       from users
                                                join reviews r on users.id = r.userid
                                       group by userid, username
                                       order by 3 desc
                                       limit 5` ,
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results.rows);
            });
    });
}
module.exports = {
    getBooksWithMostRatings,
    getBooksWithHighestRatings,
    getUsersWhoGaveMostReviews

}