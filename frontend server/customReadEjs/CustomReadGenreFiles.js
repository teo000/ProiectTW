const fs = require("fs");
const {sendErrorResponse} = require ("../helpers");
const bookPromises = require( "../promises/BooksPromises");
const ejs = require ("ejs");

const customReadGenresEjs = async (req, res, file_path, genre, pageSize, pageNumber) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const encodedGenre = encodeURIComponent(genre);
        const path = req.url;
        const booksPromise = bookPromises.getBooksInGenre(cookies,encodedGenre,pageSize,pageNumber);
        const topBooksPromise = bookPromises.getTopBooksInGenre(cookies,encodedGenre);
        const numberOfBooksPromise = bookPromises.getNumberOfBooksInGenre(cookies,encodedGenre);
        try {
            const [booksData, topBooksData, numberOfBooks] = await Promise.all([booksPromise, topBooksPromise, numberOfBooksPromise]);

            let numberOfPages = numberOfBooks / pageSize;
            if (numberOfBooks % pageSize !== 0)
                numberOfPages++;
            // Render the EJS template with the data
            const upperCasedDecodedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
            const capitalizedGenre = genre.split(" ");
            for(let i = 0; i < capitalizedGenre.length; i++){
                capitalizedGenre[i] = capitalizedGenre[i][0].toUpperCase() + capitalizedGenre[i].slice(1);
            }
            const renderedEJS = ejs.render(template, {
                books: booksData,
                topBooks: topBooksData,
                genre: capitalizedGenre.join(" "),
                currentPage: pageNumber,
                totalPages: numberOfPages
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}

module.exports = {
    customReadGenresEjs
}