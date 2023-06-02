const genreRepository = require('../repositories/GenreRepository')
const {Genre} = require('../models/GenreModel')
const bookRepository = require("../repositories/BookRepository");

const getGenre = async (req, res, name) =>{
    try {
        const genre = await genreRepository.getGenre(name);
        if (!genre) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Genre not found!'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(genre));
        }
    } catch (error) {
        console.log(error);
    }
}