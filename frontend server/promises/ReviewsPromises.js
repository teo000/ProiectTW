const http = require("http");

function getReviewsForBook  (cookies, id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/reviews/${id}`,
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

}

function getAllReviews(cookies) {
    return new Promise((resolve, reject) => {
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
}

function getReviewsMadeByUser(cookies, userid){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/reviews/userid=${userid}`,
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
}

function getReviewsMadeByUsername(cookies, username){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 6969,
            path: `/books/reviews/username=${username}`,
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
}
module.exports = {
    getReviewsForBook,
    getAllReviews,
    getReviewsMadeByUser,
    getReviewsMadeByUsername
}