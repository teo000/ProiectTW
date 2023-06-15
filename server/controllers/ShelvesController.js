const userRepository = require("../repositories/UserRepository");
const bookRepository = require("../repositories/BookRepository");
const reviewRepository = require("../repositories/ReviewRepository");
const shelvesRepository = require("../repositories/ShelvesRepository");
const addBookToShelf = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                // Validate the userId and the bookId
                const user = await userRepository.getUserById(data.userid);
                if (!user) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Error when trying to find user!'}));
                    return;
                }

                const book = await bookRepository.getBookByID(data.bookid);
                if (!book) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Book cannot be found!'}));
                    return;
                }

                const {
                    bookid,
                    userid,
                    rating,
                    shelf
                } = data;

                //check if book is already in the user's shelf
                const bookFromUserShelf = await shelvesRepository.getBookFromUserShelf(data);
                if (!bookFromUserShelf) {
                    const addedBook = await shelvesRepository.addBookToShelf(data);
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'Book added to shelf successfully', book: addedBook}));
                    return;
                }

                //if it already exists, we need to modify it
                const updatedBook = await  shelvesRepository.updateBook(data);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Book updated successfully', book: updatedBook}));

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


const getUserBooks = async (req, res) => {
    try {
        const splitString = req.url.split('/');
        if(splitString.length !==5){
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Bad request'}));
            return;
        }
        const userId = splitString[3];
        const shelfName = decodeURIComponent(splitString[4]);
        const user = await  userRepository.getUserById(userId);
        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Error when trying to find user!'}));
            return;
        }
        const userBooks = await shelvesRepository.getUserBooks(userId,shelfName);
        const rating = userBooks.rating;
        if (!userBooks || userBooks.length === 0) {
            res.writeHead(204, {'Content-Type': 'application/json'});
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(userBooks));
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    addBookToShelf,
    getUserBooks
}