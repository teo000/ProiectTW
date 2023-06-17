const bookRepository = require('../repositories/BookRepository')
const {Book} = require('../models/BookModel')
const genreRepository = require('../repositories/GenreRepository');
const bookGenresRepository = require('../repositories/BookGenresRepository');
const {authenticateToken} = require('../authentication/AuthenticationController')
const {parse} = require("url");
const {getUserFromCookie} = require("../../helpers/TokenAuthenticator");
//@route GET books/getAll
const getAllBooks = async (req, res) => {
    try {
        const books = await bookRepository.getAllBooks();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(books));
    } catch (error) {
        console.log(error.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
};

//@route /books/{id}

const getBookByID = async (req, res, id) => {
    try {
        const book = await bookRepository.getBookByID(id);
        if (!book) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Book not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
        }
    } catch (error) {
        console.log(error);
    }
}

//@route /books/{title}

const getBookByTitle = async (req, res) => {
    try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Extract the title from the pathname
        const encodedTitle = pathname.split('/').pop();
        const title = decodeURIComponent(encodedTitle).toLowerCase();
        const user = getUserFromCookie(req,res);
        const book = await bookRepository.getBookByTitle(title, user.ID);

        if (!book) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Book not found!'}));
            return;
        }
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(book));
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

//@desc : create a new book
//@route POST /books
//ex de json:
/*{
    "title": "The Hunger Games 3",
    "author": "Suzanne Collins",
    "rating" : 4.75,
    "description" :"Just as good as the first one",
    "edition" : "First",
    "publisher" : "ceva editura",
    "year" : 2014,
    "numberOfRatings" : "244325",
    "coverImg" :"https://ceva link",
    "genres": ["Young Adult", "Fiction"]
}*/
const addBook = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const bookData = JSON.parse(body);

                // Validate the required fields (username, password)
                if (!bookData.title || !bookData.author) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Book title and author are required'}));
                    return;
                }
                const {
                    title,
                    author,
                    rating,
                    description,
                    edition,
                    publisher,
                    year,
                    numberOfRatings,
                    coverImg,
                    genres
                } = bookData;

                //check if all the provided genres exist in the database
                for (const genre of genres) {
                    const foundGenre = genreRepository.getGenre([genre]);
                    if (!foundGenre) {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Genre Not found!'}));
                        return;
                    }
                }

                // Add the book to the database
                const addedBook = await bookRepository.addBook(bookData);


                //add the book genres to the book_genre_associations
                const bookID = addedBook.id;
                for (const genre of genres) {
                    const foundGenre = await genreRepository.getGenre([genre]);
                    if (!foundGenre) { //stiu ca am mai verificat inca o data dar poate intre timp cnv a sters acest genre idl
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Genre Not found!'}));
                        return;
                    }
                    const genreID = foundGenre.id;
                    const addedAssociation = await bookGenresRepository.addAssociation(bookID, genreID);
                }
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Book added successfully', book: addedBook}));

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

const getGenre = async (req, res, genre) => {
    try {
        const book = await bookRepository.getBooksByGenre(genre);
        if (!book) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Books not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
        }
    } catch (error) {
        console.log(error);
    }
}

const getTopBooksInGenre = async (req, res, genre) => {
    try {
        const books = await bookRepository.getTopBooksInGenre(genre);
        if (!books) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Books not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(books));
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    getAllBooks,
    getBookByID,
    getBookByTitle,
    addBook,
    getGenre,
    getTopBooksInGenre
}