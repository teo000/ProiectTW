const fs = require("fs");
const {sendErrorResponse} = require ("../helpers");
const {parse} =  require("querystring")
const {extractUser} = require("../../helpers/TokenAuthenticator");
const bookPromises = require( "../promises/BooksPromises");
const ejs = require ("ejs");
const genrePromises = require("../promises/GenrePromises");
const reviewPromises = require("../promises/ReviewsPromises");
const myBooksPromises = require("../promises/MyBooksPromises");

const customReadBookRecommendations = async (req, res, file_path) => {
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

        const cookiesString = JSON.stringify(cookies);
        const booksPromise = bookPromises.getRecommendations(cookiesString, userObj.ID);

        try {
            // Render the EJS template with the data
            const [booksData] = await Promise.all([booksPromise]);
            const renderedEJS = ejs.render(template, {books: booksData});

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
        const booksPromise = bookPromises.getBooksByCriteria(cookies, author, edition,publisher,year, searchInput, pageSize, pageNumber);

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
const customReadBooksEjs = async (req, res, file_path, id) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        // Extract cookies from the client's request
        const cookies = req.headers.cookie || '';

        const bookPromise= bookPromises.getBook(cookies, id);

        const genresPromise = genrePromises.getBookGenres(cookies, id);
        const reviewsPromise = reviewPromises.getReviewsForBook(cookies, id);
        const [bookData] =  await Promise.all([bookPromise]);
        const relatedBooksPromise=bookPromises.getRelatedBooks(cookies, bookData.id);

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
        const booksPromise = myBooksPromises.getUserBooks(cookiesString,userObj.ID,shelfname)

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

module.exports = {
    customReadBookRecommendations,
    customReadBooksByCriteriaEjs,
    customReadBooksEjs,
    customReadUserBooksEjs
}