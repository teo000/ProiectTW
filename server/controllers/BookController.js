const bookRepository = require('../repositories/BookRepository')
const {Book} = require('../models/BookModel')
const genreRepository = require('../repositories/GenreRepository');
const bookGenresRepository = require('../repositories/BookGenresRepository');
const rssController = require('../controllers/RSSController')
const {authenticateToken} = require('../authentication/AuthenticationController')
const {parse} = require("url");
const {getUserFromCookie} = require("../../helpers/TokenAuthenticator");
const topController = require('../controllers/TopController')
const {getUserBooks} = require("./ShelvesController");
const shelvesRepository = require("../repositories/ShelvesRepository");
const groupRepository = require("../repositories/GroupRepository");



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
        const user = getUserFromCookie(req, res);
        const book = await bookRepository.getBookByIdAndUser(id,user.ID);
        if (!book) {
            const bookById = await bookRepository.getBookByID(id);
            if(!bookById){
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Book not found!'}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(bookById));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
        }
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

//@route /books/{title}

/*const getBookByTitle = async (req, res) => {
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
*/
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
                console.log(bookData)
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
                console.log(genres);
                //check if all the provided genres exist in the database
                if(genres.length>=1)
                for (const genre of genres) {
                    const foundGenre = await genreRepository.getGenre([genre]);
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
                if(genres.length>=1)
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
                rssController.addToRss(rssController.addNewBookToFeed,addedBook);
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
    const publisher = decodeURIComponent(params.get('publisher'));
    const year = decodeURIComponent(params.get('year'));
    const author = decodeURIComponent(params.get('author'));
    const searchInput = decodeURIComponent(params.get('searchInput'))
    const pageSize = params.get('pageSize');
    let pageNumber = params.get('pageNumber');
    pageNumber = (pageNumber - 1) * pageSize;
    try {
        if (author !== "null" && author !== undefined) {
            const books = await bookRepository.getBooksByAuthor(author, pageSize, pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if (edition !== "null" && edition !== undefined) {
            const books = await bookRepository.getBooksByEdition(edition, pageSize, pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if (year !== "null" && year !== undefined) {
            const books = await bookRepository.getBooksByYear(year, pageSize, pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if (publisher !== "null" && publisher !== undefined) {
            const books = await bookRepository.getBooksByPublisher(publisher, pageSize, pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
        if (searchInput !== "null" && searchInput !== undefined) {
            const books = await bookRepository.getBooksBySearchInput(searchInput, pageSize, pageNumber);
            if (!books) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Books not found!'}));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            }
        }
    } catch (error) {
        console.log(error);
    }
}
 const getBookRecommendations = async (req,res,userId) => {
    //foreach book in the user's shelf, get related books
     try{
         //get books in user's shelf
         const booksInUserShelf =  await shelvesRepository.getUserBooks(userId,'all');

         //foreach book, get the books recommendations
         const recommendations = new Map();
         for (const book of booksInUserShelf) {
             const bookRecommendations = await bookRepository.getRelatedBooks(book.id,100,true);
             bookRecommendations.forEach((rec) =>{
                 const id = rec.id;
                recommendations.set(id,rec);
            })
         }
         if(recommendations.count === 0){
             res.writeHead(404, {'Content-Type': 'application/json'});
             res.end(JSON.stringify({error: 'Books not found!'}));
             return;
         }
         res.writeHead(200, {'Content-Type': 'application/json'});
         res.end(JSON.stringify(Array.from(recommendations.values())));
     } catch(error){
         console.log(error);
     }
 }
const getRelatedBooks = async(req,res,id,limit) => {
    try {
        const books = await bookRepository.getRelatedBooks(id,limit);

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

const deleteBook = async(req,res,bookId) =>{
    try{
        const user = await bookRepository.deleteBook(bookId);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
    }
    catch (error){
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const updateBook = async (req, res) => {
    const queryString = req.url.split('?')[1];
    const params = new URLSearchParams(queryString);
    console.log(`bookController: ${params}`);
    const bookid = params.has('bookid') ? decodeURIComponent(params.get('bookid')) : null;
    const title = params.has('title') ? decodeURIComponent(params.get('title')) : null;
    const author = params.has('author') ? decodeURIComponent(params.get('author')) : null;
    const edition = params.has('edition') ? decodeURIComponent(params.get('edition')) : null;
    const publisher = params.has('publisher') ? decodeURIComponent(params.get('publisher')) : null;
    const year = params.has('year') ? decodeURIComponent(params.get('year')) : null;
    try {
        console.log(bookid);

        if(bookid === null || bookid === undefined){
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Book not found!'}));
            return;
        }

        console.log(bookid);
        console.log(author);
        console.log(`edition: ${edition}`)
        if(author !== null && author !== undefined){
            const book = bookRepository.updateBookAuthor(parseInt(bookid, 10), author);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
            return;
        }

        if(publisher !== null && publisher !== undefined){
            const book = bookRepository.updateBookPublisher(parseInt(bookid, 10), publisher);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
            return;
        }

        if(edition !== null && edition !== undefined){
            const book = bookRepository.updateBookEdition(parseInt(bookid, 10), edition);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
            return;
        }

        if(year !== null && year !== undefined){
            const book = bookRepository.updateBookYear(parseInt(bookid, 10), parseInt(year, 10));
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(book));
            return;
        }

        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal error'}));
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const updateBookCover = async (req, res) => {

    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const bookData = JSON.parse(body);

                console.log(bookData)
                const book = await bookRepository.updateCoverImage(bookData.bookid, bookData.coverImg)
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(book));
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


const updateBookDescription = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const bookData = JSON.parse(body);

                console.log(bookData);
                const book = await bookRepository.updateBookDescription(bookData.bookid, bookData.description);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(book));
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


const deleteBookGenreAssociation = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const bookData = JSON.parse(body);

                const genre = await genreRepository.getGenre([bookData.genre]);

                console.log(genre);
                console.log(bookData);
                const book = await bookRepository.deleteBookGenre(bookData.bookid, genre.id);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(book));
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


const addBookGenreAssociation = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const bookData = JSON.parse(body);

                const genre = await genreRepository.getGenre([bookData.genre]);
                if (genre === null || genre === undefined){
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Enter an existing genre'}));
                    return;
                }

                console.log(`genre: ${genre}`);
                console.log(`bookData: ${bookData}`);
                const book = await bookRepository.addBookGenre(bookData.bookid, genre.id);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(book));
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
    getAllBooks,
    getBookByID,
    addBook,
    getGenre,
    getTopBooksInGenre,
    getGenreCount,
    getBooksByCriteria,
    getRelatedBooks,
    getBookRecommendations,
    deleteBook,
    updateBook,
    updateBookCover,
    updateBookDescription,
    deleteBookGenreAssociation,
    addBookGenreAssociation
}