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
        const user = getUserFromCookie(req, res);
        const book = await bookRepository.getBookByTitleAndUser(title, user.ID);

        if (!book) {
            //try to find it by title only
            const bookByTitle = await bookRepository.getBookByTitle(title);
            if (!bookByTitle) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Book not found!'}));
                return;
            }
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(bookByTitle));
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

const getGenre = async (req, res, genre, pageSize, pageNumber) => {
    try {
        const limit = pageSize;
        const offset = (pageNumber - 1) * pageSize;
        const book = await bookRepository.getBooksByGenre(genre, limit, offset);
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

const getGenreCount = async (req, res, genre) => {
    try {
        const number = await bookRepository.getGenreCount(genre);
        if (number.count > 3000) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(3000));//limitex nr de carti
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(number));
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

const getBooksByCriteria = async (req, res) => {
    const queryString = req.url.split('?')[1];
    const params = new URLSearchParams(queryString);
    const edition = decodeURIComponent(params.get('edition'));
    const publisher = params.get('publisher');
    const year = params.get('year');
    const author = params.get('author');
    const pageSize = params.get('pageSize');
    let pageNumber = params.get('pageNumber');
     pageNumber = (pageNumber - 1) * pageSize;
    try {
        if (author !== "null" && author!==undefined) {
            const books = await bookRepository.getBooksByAuthor(author,pageSize,pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if(edition !== "null" && edition!==undefined){
            const books = await bookRepository.getBooksByEdition(edition,pageSize,pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if(year !== "null" && year!==undefined){
            const books = await bookRepository.getBooksByYear(year,pageSize,pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if(publisher !=="null" && publisher!==undefined){
            const books = await bookRepository.getBooksByPublisher(publisher,pageSize,pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}
module.exports = {
    getAllBooks,
    getBookByID,
    getBookByTitle,
    addBook,
    getGenre,
    getTopBooksInGenre,
    getGenreCount,
    getBooksByCriteria
}