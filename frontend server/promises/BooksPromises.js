const http = require("http");
function getTopBooks(cookies){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/top`,
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
                const topBooksData = JSON.parse(data);
                resolve(topBooksData);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}
module.exports = {
    getTopBooks
}