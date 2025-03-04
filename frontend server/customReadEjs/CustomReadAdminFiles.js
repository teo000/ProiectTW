const fs = require("fs");
const {sendErrorResponse} = require("../helpers");
const ejs = require("ejs");
const reviewPromises = require("../promises/ReviewsPromises");
const otherPromises = require("../promises/OtherPromises");


const customReadUserForAdminEjs = async (req, res, file_path, username) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }
        const cookies = req.headers.cookie || '';

        const reviewsPromise = reviewPromises.getReviewsMadeByUsername(cookies, username);
        try {
            const [reviewsData] = await Promise.all([reviewsPromise]);
            console.log(reviewsData);
            const modifiedReviewDate = reviewsData.map(review => {
                const date = new Date(review.date);
                const formattedDate = date.toISOString().slice(0, 10);
                return {...review, date: formattedDate}
            })
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {user: {username: username}, reviews: modifiedReviewDate});

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

const customReadUsersEjs = async (req, res, filepath, group) => {
    const template = fs.readFileSync(filepath, "utf8");
    if (!template) {
        sendErrorResponse(res);
        return;
    }

    const cookies = req.headers.cookie || '';
    const usersPromise = otherPromises.getAllUsers(cookies);

    try {
        const [usersData] = await Promise.all([usersPromise]);
        console.log(usersData);
        // Render the EJS template with the data
        const renderedEJS = ejs.render(template, {users: usersData});

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(renderedEJS);
    } catch (error) {
        console.log(error);
        sendErrorResponse(res);
    }
}


module.exports = {
    customReadUserForAdminEjs,
    customReadUsersEjs,
}