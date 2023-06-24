const fs = require("fs");
const {sendErrorResponse} = require ("../helpers");
const {parse} =  require("querystring")
const {extractUser} = require("../../helpers/TokenAuthenticator");
const bookPromises = require( "../promises/BooksPromises");
const ejs = require ("ejs");
const reviewPromises = require("../promises/ReviewsPromises");
const otherPromises = require("../promises/OtherPromises");

const customReadHomepageEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        const cookies = req.headers.cookie || '';

        const reviewsPromise = reviewPromises.getAllReviews(cookies);
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

const customReadUserEjs = async (req, res, file_path, username) => {
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


        const reviewsPromise = reviewPromises.getReviewsMadeByUser(cookies, userObj.ID);
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

const customReadStatisticsEjs = async (req, res, filepath) => {
    if (fs.existsSync(filepath)) {
        const template = fs.readFileSync(filepath, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const statisticsPromise = otherPromises.getStatistics(cookies);

        try {
            const [statisticsData] = await Promise.all([statisticsPromise]);

            const renderedEjs = ejs.render(template, {
                mostRatedBooks: statisticsData.mostRatings,
                highestRatedBooks: statisticsData.highestRatings,
                usersMostReviews: statisticsData.mostReviewsGiven
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEjs);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    } else {
        sendErrorResponse(res);
    }
}
module.exports ={
    customReadHomepageEjs,
    customReadUserEjs,
    customReadStatisticsEjs
}