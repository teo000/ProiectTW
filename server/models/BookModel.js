class Book {
    constructor(ID,title, author, rating, description, edition, publisher, publishDate,
                numberOfRatings, coverImg) {
        this.ID = ID;
        this.title = title;
        this.author = author;
        this.rating = rating;
        this.description = description;
        this.edition = edition;
        this.publisher = publisher;
        this.publishDate = publishDate;
        this.numberOfRatings = numberOfRatings;
        this.coverImg = coverImg;
    }
}

module.exports = {
    Book
}