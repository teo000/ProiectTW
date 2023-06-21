//aici vin requesturile pt incarcare de pagini html
const http = require("http");
const fs = require('fs');
const ejs = require('ejs')
const bookPromises = require('./promises/BooksPromises')
const PORT = 8081;

const PageController = require("./controller/PageController")
const {authenticateToken, extractUser} = require("../helpers/TokenAuthenticator");
const {createServer} = require("https");
const {parse} = require("querystring");

const getFileUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    console.log(`../views/${ending}.html`);
    return `../views/${ending}.html`
};
const getScriptsUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/scripts/${ending}`;
};
const getCssUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/css/${ending}`;
};
const getImagesUrl = (url) => {
    const ending = url.substring(url.lastIndexOf("/") + 1);
    return `../public/images/${ending}`;
};
const sendErrorResponse = res => {
    res.writeHead(404, {
        "Content-Type": "text/html"
    });
    res.write("<h1>File Not Found!</h1>");
    res.end();
};

const customReadFile = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        fs.readFile(file_path, (error, data) => {
            if (error) {
                console.log(error);
                sendErrorResponse(res);
                return;
            }
            res.write(data);
            res.end();
        });
    } else {
        sendErrorResponse(res);
    }
};


const customReadGenresEjs = async (req, res, file_path, genre, pageSize, pageNumber) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const encodedGenre = encodeURIComponent(genre);
        const path = req.url;
        const booksPromise = new Promise((resolve, reject) => {
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
        const topBooksPromise = new Promise((resolve, reject) => {
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
        const numberOfBooksPromise = new Promise((resolve, reject) => {
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
        try {
            const [booksData, topBooksData, numberOfBooks] = await Promise.all([booksPromise, topBooksPromise, numberOfBooksPromise]);

            let numberOfPages = numberOfBooks / pageSize;
            if (numberOfBooks % pageSize !== 0)
                numberOfPages++;
            // Render the EJS template with the data
            const upperCasedDecodedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
            const renderedEJS = ejs.render(template, {
                books: booksData,
                topBooks: topBooksData,
                genre: upperCasedDecodedGenre,
                currentPage: pageNumber,
                totalPages: numberOfPages
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}

const customReadBooksByCriteriaEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const queryString = req.url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const edition = encodeURIComponent(params.get('edition'));
        const publisher = encodeURIComponent(params.get('publisher'));
        const pageSize = encodeURIComponent(params.get('pageSize'));
        const pageNumber = encodeURIComponent(params.get('pageNumber'));
        const year = encodeURIComponent(params.get('year'));
        const author = encodeURIComponent(params.get('author'));
        const searchInput = encodeURIComponent(params.get('searchInput'))
        const path = `/books/criteria?author=${author}&edition=${edition}&publisher=${publisher}&year=${year}&searchInput=${searchInput}&pageSize=${pageSize}&pageNumber=${pageNumber}`
        const booksPromise = new Promise((resolve, reject) => {
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

        const topBooksPromise = bookPromises.getTopBooks(cookies);
        try {
            const [booksData, topBooksData] = await Promise.all([booksPromise, topBooksPromise]);

            const numberOfBooks = [booksData].length;
            let numberOfPages = numberOfBooks / pageSize;
            if (numberOfBooks % pageSize !== 0)
                numberOfPages++;
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {
                books: booksData,
                topBooks: topBooksData,
                currentPage: pageNumber,
                totalPages: numberOfPages
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}
const customReadHomepageEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        const cookies = req.headers.cookie || '';

        const reviewsPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/reviews/all`,
                headers: {
                    'Cookie': cookies
                }
            };

            http.get(options, (response) => {
                let reviewsData = "";
                response.on("data", (chunk) => {
                    reviewsData += chunk;
                });
                response.on('end', () => {
                    try {
                        reviewsData = JSON.parse(reviewsData);
                    } catch (error) {
                        reviewsData = [];
                    }
                    resolve(reviewsData);
                });
            }).on("error", (error) => {
                console.log(error);
                reject(error);
            });
        });
        const topBooksPromise = bookPromises.getTopBooks(cookies);
        try {
            const [reviewsData, topBooksData] = await Promise.all([reviewsPromise, topBooksPromise]);

            const modifiedReviewDate = reviewsData.map(review => {
                const date = new Date(review.date);
                const formattedDate = date.toISOString().slice(0, 10);
                return {...review, date: formattedDate}
            });
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {reviews: modifiedReviewDate, topBooks: topBooksData});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    } else {
        sendErrorResponse(res);
    }
}

const customReadBooksEjs = async (req, res, file_path, title) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        // Extract cookies from the client's request
        const cookies = req.headers.cookie || '';

        const bookPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/getBook/${title}`,
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

        const genresPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/genres/${title}`,
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

        const reviewsPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/reviews/${title}`,
                headers: {
                    'Cookie': cookies
                }
            };

            http.get(options, (response) => {
                let reviewsData = "";
                response.on("data", (chunk) => {
                    reviewsData += chunk;
                });
                response.on('end', () => {
                    try {
                        reviewsData = JSON.parse(reviewsData);
                    } catch (error) {
                        reviewsData = [];
                    }
                    resolve(reviewsData);
                });
            }).on("error", (error) => {
                console.log(error);
                reject(error);
            });
        });

        const [bookData] =  await Promise.all([bookPromise]);
        const relatedBooksPromise= new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/related/${bookData.id}/7`,
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

        try {
            const [relatedBooksData, genreData, reviewsData] = await Promise.all([relatedBooksPromise, genresPromise, reviewsPromise]);

            const modifiedReviewDate = reviewsData.map(review => {
                const date = new Date(review.date);
                const formattedDate = date.toISOString().slice(0, 10);
                return {...review, date: formattedDate}
            })
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {book: bookData, genres: genreData, reviews: modifiedReviewDate, relatedBooks : relatedBooksData});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    } else {
        sendErrorResponse(res);
    }
}

const customReadUserEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        // Extract cookies from the client's request
        const cookies = req.headers.cookie || '';

        const cookieCopy = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
        if (!cookieCopy.access_token) {
            res.writeHead(401, {"Content-Type": "text/html"});
            res.end('<h1>Unauthorized</h1>');
            return;
        }
        const user = extractUser(cookieCopy.access_token);
        if (!user) {
            res.writeHead(401, {"Content-Type": "text/html"});
            res.end('<h1>Unauthorized</h1>');
            return;
        }
        const userObj = user.user;


        const reviewsPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/reviews/userid=${userObj.ID}`,
                headers: {
                    'Cookie': cookies
                }
            };

            http.get(options, (response) => {
                let reviewsData = "";
                response.on("data", (chunk) => {
                    reviewsData += chunk;
                });
                response.on('end', () => {
                    try {
                        reviewsData = JSON.parse(reviewsData);
                    } catch (error) {
                        reviewsData = [];
                    }
                    resolve(reviewsData);
                });
            }).on("error", (error) => {
                console.log(error);
                reject(error);
            });
        });
        try {
            const [reviewsData] = await Promise.all([reviewsPromise]);
            console.log(reviewsData);
            const modifiedReviewDate = reviewsData.map(review => {
                const date = new Date(review.date);
                const formattedDate = date.toISOString().slice(0, 10);
                return {...review, date: formattedDate}
            })
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {reviews: modifiedReviewDate, user: userObj});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    } else {
        sendErrorResponse(res);
    }
}


const customReadUserBooksEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        // Extract cookies from the client's request
        const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
        if (!cookies.access_token) {
            res.writeHead(401, {"Content-Type": "text/html"});
            res.end('<h1>Unauthorized</h1>');
            return;
        }
        let user = null;
        try {
            user = extractUser(cookies.access_token);
        } catch (error) {
            res.writeHead(403, {"Content-Type": "text/html"});
            res.end('<h1>Forbidden</h1>');
            return;
        }

        if (!user) {
            res.writeHead(401, {"Content-Type": "text/html"});
            res.end('<h1>Unauthorized</h1>');
            return;
        }
        const userObj = user.user;


        const shelfname = req.url.split('/')[3];

        const cookiesString = JSON.stringify(cookies);
        const booksPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/mybooks/${userObj.ID}/${shelfname}`,
                headers: {
                    'Cookie': cookiesString // Pass the extracted cookies in the request headers
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

        try {
            // Render the EJS template with the data
            const [booksData] = await Promise.all([booksPromise]);
            const renderedEJS = ejs.render(template, {books: booksData, url: req.url});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    } else {
        sendErrorResponse(res);
    }
}


const customReadMyGroupsEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';

        const groupPromise = new Promise((resolve, reject) => {
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

        try {
            const [groupsData] = await Promise.all([groupPromise]);
            console.log(groupsData);
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {groups: groupsData});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}


const customReadGroupEjs = async (req, res, filepath, group) => {
    const template = fs.readFileSync(filepath, "utf8");
    if (!template) {
        sendErrorResponse(res);
        return;
    }

    const cookies = req.headers.cookie || '';

    const groupPromise = new Promise((resolve, reject) => {
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

    const membersPromise = new Promise((resolve, reject) => {
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

    try {
        const [groupData, membersData] = await Promise.all([groupPromise, membersPromise]);
        console.log(groupData);
        // Render the EJS template with the data
        const renderedEJS = ejs.render(template, {group: groupData, members: membersData});

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(renderedEJS);
    } catch (error) {
        console.log(error);
        sendErrorResponse(res);
    }
}

const customReadStatisticsEjs = async (req, res, filepath) => {
    if (fs.existsSync(filepath)) {
        const template = fs.readFileSync(filepath, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const statisticsPromise = new Promise((resolve, reject) => {
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

        try {
            const [statisticsData] = await Promise.all([statisticsPromise]);

            const renderedEjs = ejs.render(template, {mostRatedBooks: statisticsData.mostRatings, highestRatedBooks : statisticsData.highestRatings, usersMostReviews : statisticsData.mostReviewsGiven});
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEjs);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
    else{
        sendErrorResponse(res);
    }
}
const server = http.createServer((req, res) => {

    const url = req.url;
    console.log(`front request: ${url}`);

    if (url.startsWith('/books/genres?') && url.indexOf(".") === -1) {
        const queryString = req.url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const genre = params.get('genre');
        const pageSize = params.get('pageSize');
        const pageNumber = params.get('pageNumber');
        customReadGenresEjs(req, res, `../views/ejs/genres.ejs`, genre, pageSize, pageNumber);
        //   authenticateToken(req, res, customReadEjsFile,`../views/ejs/genres.ejs`,genre);
    } else if (url.startsWith('/books/getBook/') && url.indexOf(".") === -1) {
        const title = url.split('/')[3].toLowerCase();
        authenticateToken(req, res, customReadBooksEjs, `../views/ejs/bookpage.ejs`, title);
    } else if (url.startsWith('/profile') && url.indexOf(".") === -1) {
        customReadUserEjs(req, res, `../views/ejs/profile.ejs`);
    } else if (req.url.startsWith('/books/criteria?')) {
        customReadBooksByCriteriaEjs(req, res, '../views/ejs/booksByCriteria.ejs');
    } else if (url.startsWith('/groups/mygroups') && url.indexOf(".") === -1) {
        customReadMyGroupsEjs(req, res, '../views/ejs/mygroups.ejs');
    } else if (url.startsWith('/groups/group/') && url.indexOf(".") === -1) {
        const group = url.split('/')[3].toLowerCase();
        customReadGroupEjs(req, res, `../views/ejs/grouppage.ejs`, group);
    } else if (url.startsWith('/books/mybooks/') && url.indexOf(".") === -1) {
        customReadUserBooksEjs(req, res, `../views/ejs/mybooks.ejs`);
    } else if (url === '/homepage') {
        customReadHomepageEjs(req, res, `../views/ejs/homepage.ejs`);
    } else if (url.startsWith('/statistics') && url.indexOf('.')==-1) {
        customReadStatisticsEjs(req, res, `../views/ejs/statistics.ejs`);
    } else if (url.indexOf(".") === -1) {
        //its an html request{
        //check if it is login
        if (url.indexOf("rss") !== -1) {
            authenticateToken(req, res, customReadFile, `../views/rss/rssfeed.xml`);
            return;
        }
        if (url.indexOf("login") === -1 && url.indexOf("signup") === -1) {
            //  res.writeHead(200, {"Content-Type": "text/html"});
            authenticateToken(req, res, customReadFile, getFileUrl(url));
            // customReadFile(req, res, getFileUrl(url));
            return;
        }

        res.setHeader('Cache-Control', 'max-age=31536000')
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadFile(req, res, getFileUrl(url));

    } else if (url.indexOf(".js") !== -1) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        customReadFile(req, res, getScriptsUrl(url));
    } else if (url.indexOf(".css") !== -1) {
        res.writeHead(200, {"Content-Type": "text/css"});
        customReadFile(req, res, getCssUrl(url));
    } else if (url.indexOf(".png") !== -1) {
        res.setHeader('Cache-Control', 'max-age=31536000')

        res.writeHead(200, {"Content-Type": "image/png"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".jpg") !== -1) {
        res.setHeader('Cache-Control', 'max-age=31536000')
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".ejs") !== -1) {
        //make request to server to get data
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadGenresEjs(req, res, `../views/ejs/${url}`);
    } else sendErrorResponse(res);

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
