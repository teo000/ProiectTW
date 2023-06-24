const http = require("http");

function getBookGenres (cookies, id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/genres/${id}`,
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
                const genreData = JSON.parse(data);
                resolve(genreData);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}

module.exports = {
    getBookGenres
}