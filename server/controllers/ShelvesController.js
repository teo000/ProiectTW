const userRepository = require("../repositories/UserRepository");
const bookRepository = require("../repositories/BookRepository");
const reviewRepository = require("../repositories/ReviewRepository");
const shelvesRepository = require("../repositories/ShelvesRepository");
const {extractUser} = require("../../helpers/TokenAuthenticator");
const {parse} = require("querystring");

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
                const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
                const user = extractUser(cookies.access_token).user;
                const userInRepo = await userRepository.getUserById(user.ID);
                if (!userInRepo) {
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

                const dataToSend = {
                    bookid: data.bookid,
                    userid: userInRepo.id,
                    rating: data.rating,
                    shelf: data.shelf
                }

                //check if book is already in the user's shelf
                const bookFromUserShelf = await shelvesRepository.getBookFromUserShelf(dataToSend);
                if (!bookFromUserShelf) {
                    const addedBook = await shelvesRepository.addBookToShelf(dataToSend);
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'Book added to shelf successfully', book: addedBook}));
                    return;
                }

                //if it already exists, we need to modify it
                const updatedBook = await shelvesRepository.updateBook(dataToSend);
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
        if (splitString.length !== 5) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Bad request'}));
            return;
        }
        const userId = splitString[3];
        const shelfName = decodeURIComponent(splitString[4]);
        const user = await userRepository.getUserById(userId);
        if (!user) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Error when trying to find user!'}));
            return;
        }
        const userBooks = await shelvesRepository.getUserBooks(userId, shelfName);
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


const removeBookFromShelf = async (req, res) => {
    try {
        const bookIdString = req.url.split('?')[1];
        const bookId = bookIdString.split('=')[1];
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

        const userFromDB = await userRepository.getUserById(userObj.ID);
        if (!userFromDB) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Error when trying to find user!'}));
            return;
        }

        const data =
            {bookid: bookId, userid: userObj.ID};

        shelvesRepository.deleteBookFromShelf(data)
            .then((row) => {
                    if (row === undefined) {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Book deleted from shelf'}));
                    }
                }
            )
            .catch((error) => {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: error}));
            })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addBookToShelf,
    getUserBooks,
    removeBookFromShelf
}