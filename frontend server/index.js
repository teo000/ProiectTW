//aici vin requesturile pt incarcare de pagini html
const http = require("http");
const fs = require('fs');
const ejs = require('ejs')
const cssRouter = require("./routes/CssRouter")
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


const customReadGenresEjs = async (req, res, file_path, genre) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const decodedGenre = decodeURIComponent(genre);
        const booksPromise = new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 6969,
                path: `/books/genres/${genre}`,
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
                path: `/books/genres/top/${genre}`,
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
        try {
            const [booksData, topBooksData] = await Promise.all([booksPromise, topBooksPromise]);


            // Render the EJS template with the data
            const upperCasedDecodedGenre = decodedGenre.charAt(0).toUpperCase() + decodedGenre.slice(1);
            const renderedEJS = ejs.render(template, {
                books: booksData,
                topBooks: topBooksData,
                genre: upperCasedDecodedGenre
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}

const customReadBooksEjs = async (req, res, file_path, title) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        const decodedTitle = decodeURIComponent(title);

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

        try {
            const [booksData, genreData] = await Promise.all([bookPromise, genresPromise]);

            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, { book: booksData, genres: genreData });

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
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
        const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
        const user = extractUser(cookies.access_token);
        const userObj = user.user;

        try {
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, { user: userObj});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
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

    if (url.startsWith('/books/genres/') && url.indexOf(".") === -1) {
        const genre = url.split('/')[3].toLowerCase();
        customReadGenresEjs(req, res, `../views/ejs/genres.ejs`, genre);
        //   authenticateToken(req, res, customReadEjsFile,`../views/ejs/genres.ejs`,genre);
    } else if (url.startsWith('/books/getBook/') && url.indexOf(".") === -1) {
        const title = url.split('/')[3].toLowerCase();
        customReadBooksEjs(req, res, `../views/ejs/bookpage.ejs`, title);
    } else if(url.startsWith('/profile') && url.indexOf(".") === -1) {
        customReadUserEjs(req, res, `../views/ejs/profile.ejs`);
    } else if (url.indexOf(".") === -1) {
        //its an html request{
        //check if it is login
        if (url.indexOf("login") === -1 && url.indexOf("signup") === -1) {
          //  res.writeHead(200, {"Content-Type": "text/html"});
             authenticateToken(req, res, customReadFile,getFileUrl(url));
           // customReadFile(req, res, getFileUrl(url));
            return;
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        customReadFile(req, res, getFileUrl(url));

    } else if (url.indexOf(".js") !== -1) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        customReadFile(req, res, getScriptsUrl(url));
    } else if (url.indexOf(".css") !== -1) {
        res.writeHead(200, {"Content-Type": "text/css"});
        customReadFile(req, res, getCssUrl(url));
    } else if (url.indexOf(".png") !== -1) {
        res.writeHead(200, {"Content-Type": "image/png"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".jpg") !== -1) {
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".ejs") !== -1) {
        //make request to server to get data
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadGenresEjs(req, res, `../views/ejs/${url}`);
    } else sendErrorResponse(res);

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
