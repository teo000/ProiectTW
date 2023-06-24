const http = require("http");

function getMyGroups (cookies){
    return new Promise((resolve, reject) => {
        console.log("group promise");

        const options = {
            method: 'GET',
            hostname: 'localhost',
            port: 6969,
            path: `/groups/mygroups`,
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

function getAllGroups(cookies){
    return  new Promise((resolve, reject) => {
        console.log("group promise");

        const options = {
            method: 'GET',
            hostname: 'localhost',
            port: 6969,
            path: `/groups/allgroups`,
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
function getGroupPage(cookies, group){
    return  new Promise((resolve, reject) => {
        console.log("group promise");

        const options = {
            method: 'GET',
            hostname: 'localhost',
            port: 6969,
            path: `/groups/group/${group}`,
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

function getGroupMembers(cookies,group){
    return new Promise((resolve, reject) => {
        console.log("members promise");

        const options = {
            method: 'GET',
            hostname: 'localhost',
            port: 6969,
            path: `/groups/members/${group}`,
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
module.exports ={
    getMyGroups,
    getAllGroups,
    getGroupPage,
    getGroupMembers
}