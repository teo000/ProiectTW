const http = require("http");

function getUserBooks(cookies,id, shelf){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/mybooks/${id}/${shelf}`,
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
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = [];
                }
                resolve(data);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}

module.exports = {
    getUserBooks
}