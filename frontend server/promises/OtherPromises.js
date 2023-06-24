const http = require("http");

function getAllUsers (cookies){
    return  new Promise((resolve, reject) => {
        console.log("group promise");

        const options = {
            method: 'GET',
            hostname: 'localhost',
            port: 6969,
            path: `/users`,
            headers: {
                'Cookie': cookies // Pass the extracted cookies in the request headers
            }
        };

        http.get(options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const groupsData = JSON.parse(data);
                resolve(groupsData);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}

function getStatistics(cookies) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/statistics`,
            headers: {
                'Cookie': cookies // Pass the extracted cookies in the request headers
            }
        };
        http.get(options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const booksData = JSON.parse(data);
                resolve(booksData);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}

module.exports = {
    getAllUsers,
    getStatistics
}