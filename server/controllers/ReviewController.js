const reviewRepository = require('../repositories/ReviewRepository')
const {Genre} = require('../models/GenreModel')
const bookRepository = require("../repositories/BookRepository");
const genreRepository = require("../repositories/GenreRepository");
const bookGenresRepository = require("../repositories/BookGenresRepository");
const userRepository = require("../repositories/UserRepository");

const addReview = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const reviewData = JSON.parse(body);

                // Validate the userId and the bookId
                const user = await userRepository.getUser(reviewData.username);
                if(!user){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }
                const userId = user.id;

                const book = await bookRepository.getBookByID(reviewData.bookid);
                if(!book){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }

                const {username,
                    bookid,
                    date,
                    content,
                    stars} = reviewData;
                reviewData.username = userId;


                // Add the review to the database
                const addedReview = await reviewRepository.addReview(reviewData);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Review added successfully', review: addedReview}));

            } catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

module.exports = {
    addReview
}