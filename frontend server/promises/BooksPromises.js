const http = require("http");

function getTopBooks(cookies) {
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

function getNumberOfBooksInGenre(cookies,encodedGenre){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/genres/count?genre=${encodedGenre}`,
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
                const number = Number(data);
                resolve(number);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    })
}
function getTopBooksInGenre (cookies, encodedGenre){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/genres/top/${encodedGenre}`,
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

function getBook(cookies, id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/${id}`,
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

function getRelatedBooks(cookies, id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/related/${id}/7`,
            headers: {
                'Cookie': cookies
            }
        };

        http.get(options, (response) => {
            let relatedBooksData = "";
            response.on("data", (chunk) => {
                relatedBooksData += chunk;
            });
            response.on('end', () => {
                try {
                    relatedBooksData = JSON.parse(relatedBooksData);
                } catch (error) {
                    relatedBooksData = [];
                }
                resolve(relatedBooksData);
            });
        }).on("error", (error) => {
            console.log(error);
            reject(error);
        });
    });
}

function getBooksInGenre(cookies, encodedGenre, pageSize, pageNumber) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/genres?genre=${encodedGenre}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
            headers: {
                'Cookie': cookies // Pass the extracted cookies in the request headers
            }
        };
        //make request to server to get genre data, also should make request to get clasament

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
function getBooksByCriteria (cookies,author, edition, publisher, year, searchInput, pageSize, pageNumber){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/criteria?author=${author}&edition=${edition}&publisher=${publisher}&year=${year}&searchInput=${searchInput}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
            headers: {
                'Cookie': cookies // Pass the extracted cookies in the request headers
            }
        };
        //make request to server to get genre data, also should make request to get clasament

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

function getRecommendations (cookies, id){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/recommendations/${id}`,
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
    getTopBooks,
    getBook,
    getRelatedBooks,
    getBooksInGenre,
    getTopBooksInGenre,
    getNumberOfBooksInGenre,
    getBooksByCriteria,
    getRecommendations
}