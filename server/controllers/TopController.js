const bookRepository = require("../repositories/BookRepository");
const rssController = require("./RSSController");
const genreRepository = require('../repositories/GenreRepository')

async function changeTop(id) {
    try {
        let genres = await genreRepository.getGenresForBook(id);
        if(!genres){
          return;
        }
        genres.push({name: "any"});
        for (const genre of genres) {
            const books = await bookRepository.getTopBooksInGenreOverall(genre.name.toLowerCase());
            const isTopChanged = await bookRepository.isTopChanged(genre.name.toLowerCase(), Number(books[0].id), Number(books[1].id), Number(books[2].id));

            if (isTopChanged.rowCount > 0) {
                await bookRepository.changeTop(genre.name.toLowerCase(), Number(books[0].id), Number(books[1].id), Number(books[2].id));
                const data = {
                    genre: genre.name,
                    firstTitle: books[0].title,
                    firstAuthor: books[0].author,
                    secondTitle: books[1].title,
                    secondAuthor: books[1].author,
                    thirdTitle: books[2].title,
                    thirdAuthor: books[2].author,
                }
                rssController.addToRss(rssController.addTopChangeToFeed,data);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    changeTop
}