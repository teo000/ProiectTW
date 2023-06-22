const reviewRepository = require('../repositories/ReviewRepository')
const {Genre} = require('../models/GenreModel')
const bookRepository = require("../repositories/BookRepository");
const genreRepository = require("../repositories/GenreRepository");
const bookGenresRepository = require("../repositories/BookGenresRepository");
const userRepository = require("../repositories/UserRepository");
const {getUserFromCookie} = require("../../helpers/TokenAuthenticator");
const rssController = require('../controllers/RSSController')
const {parse} = require("url");
const topController = require("./TopController");

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
                const user = getUserFromCookie(req,res);
                if(user=== undefined)
                    return;
                const userFromRepo = await userRepository.getUserById(user.ID);
                if(!userFromRepo){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }
                const userId = userFromRepo.id;

                const book = await bookRepository.getBookByID(reviewData.bookid);
                if(!book){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Book id incorrect!'}));
                    return;
                }

                const alreadyExistingReview = await reviewRepository.getUserBookReviews(reviewData.bookid, userId);
                let stars = 0;
                if(alreadyExistingReview)
                    stars = alreadyExistingReview[0].stars;
                const data = {
                    username:userId,
                    bookid : reviewData.bookid,
                    date: reviewData.date,
                    content: reviewData.content,
                    stars:stars,
                    isgeneric:false
                }
                // Add the review to the database
                //delete any review made by the same user to the same book
                const deletedReview = await reviewRepository.deleteUserBookReview( data.bookid, data.username)
                const addedReview = await reviewRepository.addReview(data);

                const dataForRss = {
                    bookTitle:book.title,
                    author:book.author,
                    username:userFromRepo.username,
                    stars:data.stars,
                    date:data.date,
                    content:data.content
                }
                rssController.addToRss(rssController.addReviewToFeed,dataForRss);
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

const addGenericReview = async(req,res) =>{
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const reviewData = JSON.parse(body);

                // Validate the userId and the bookId
                const user = getUserFromCookie(req,res);
                if(user=== undefined)
                    return;
                const userFromRepo = await userRepository.getUserById(user.ID);
                if(!userFromRepo){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }
                const userId = userFromRepo.id;

                const book = await bookRepository.getBookByID(reviewData.bookid);
                if(!book){
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Username incorrect!'}));
                    return;
                }

                const dataToSend =
                    {
                        username : userId,
                        bookid : reviewData.bookid,
                        date: reviewData.date,
                        content: `I rated ${book.title} by ${book.author} ${reviewData.stars} stars!`,
                        stars : reviewData.stars,
                        isgeneric:true
                    }

                // check if the review exists in the database
                const reviewToDelete = await reviewRepository.getUserBookReviews(reviewData.bookid, userId);
                if(reviewToDelete[0]){
                    //nu mai sterg daca e generic, schimb doar ratingul si ratingul cartii
                    const oldRating = reviewToDelete[0].stars;
                   await reviewRepository.updateBookRating( oldRating, reviewData.stars,reviewData.bookid);
                    //schimb nr de stele de la review
                    const updatedReview =  await  reviewRepository.changeReviewStars(reviewData.stars, reviewData.bookid, userId);
                     await topController.changeTop(book.title);
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'Review added successfully'}));
                    return;
                }

                const addedReview = await reviewRepository.addReview(dataToSend);
                await reviewRepository.addRatingToBook(reviewData.bookid, reviewData.stars);

                await topController.changeTop(book.title);
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

const getBookReviews = async(req,res) =>{
    try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Extract the title from the pathname
        const encodedTitle = pathname.split('/').pop();
        const title = decodeURIComponent(encodedTitle).toLowerCase();
        const user = getUserFromCookie(req,res);
        if(user === undefined)
            return;
        const book = await bookRepository.getBookByTitle(title);

        if (!book) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Book not found!'}));
            return;
        }
        const bookReviews = await reviewRepository.getBookReviews(book.id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(bookReviews));
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const getAllReviews = async (req,res)=>{
   try{
       const reviews = await reviewRepository.getAllReviews();
       res.writeHead(200, {'Content-Type': 'application/json'});
       res.end(JSON.stringify(reviews));
   }
   catch (error){
       console.log(error);
       res.writeHead(500, {'Content-Type': 'application/json'});
       res.end(JSON.stringify({error: 'Internal Server Error'}));
   }
}

const getReviewsMadeByUser = async(req,res,id) =>{
    try{
        const reviews = await reviewRepository.getReviewsMadeByUser(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(reviews));
    }
    catch (error){
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const getReviewsByUsername = async(req,res,username) =>{
    try{
        const reviews = await reviewRepository.getReviewsByUsername(username);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(reviews));
    }
    catch (error){
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const deleteReview = async(req,res,id) =>{
    try{
        const reviews = await reviewRepository.deleteReview(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(reviews));
    }
    catch (error){
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}
module.exports = {
    addReview,
    addGenericReview,
    getBookReviews,
    getAllReviews,
    getReviewsMadeByUser,
    getReviewsByUsername,
    deleteReview
}