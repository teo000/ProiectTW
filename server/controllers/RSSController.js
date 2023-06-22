const fs = require('fs');
const xml2js = require('xml2js');
const {Feed} = require("feed");
const moment = require('moment');

function generateRssFeed() {
    return new Promise((resolve, reject) => {
        const feed = new Feed({
            title: "Book Reviewer RSS Feed",
            description: "Recently added books, reviews and top book changes",
            id: "http:/localhost:8081",
            link: "http:/localhost:8081",
            author: [
                {
                    name: "Savin Miruna",
                    group: "2A5"
                },
                {
                    name: "Tudurache Teodora",
                    group: "2A5"
                }
            ]
        });

        const feedXML = feed.rss2();
        console.log(process.cwd());
        fs.writeFileSync('../views/rss/rssfeed.xml', feedXML, 'utf8', (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            }
        );
        console.log("ok");
    })
}

function addToRss(updateRssFile, data){
    fs.access('../views/rss/rssfeed.xml', fs.constants.F_OK, (err) => {
        if (err) {
            generateRssFeed()
                .then(() => updateRssFile(data))
                .catch((err) => console.log(err));
        }
        else updateRssFile(data);
    });
}

function addReviewToFeed(review) {
    const xmlData = fs.readFileSync('../views/rss/rssfeed.xml', 'utf8');

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const feed = result;
        const newReview = {
            title: `New Review for book "${review.bookTitle}" by "${review.author}"`,
            description: `Review of ${review.stars} stars made by user "${review.username}": "${review.content}"`,
            date: `${review.date}`,
            author: {
                name: `${review.username}`
            }
        };
        // Check if the item array exists, if not initialize it as an empty array
        if (!Array.isArray(feed.rss.channel[0].item)) {
            feed.rss.channel[0].item = [];
        }
        feed.rss.channel[0].item.push(newReview);
        const builder = new xml2js.Builder();
        const updatedFeed = builder.buildObject(feed);
        fs.writeFileSync('../views/rss/rssfeed.xml', updatedFeed, 'utf8');
        console.log("update done");
    })
}
function addTopChangeToFeed(data) {
    const xmlData = fs.readFileSync('../views/rss/rssfeed.xml', 'utf8');

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const feed = result;
        const newTop = {
            title: `The top for ${data.genre} books has changed!`,
            description: `On the first place : "${data.firstTitle}" by ${data.firstAuthor};
            On the second place : "${data.secondTitle}" by ${data.secondAuthor};
            On the third place : "${data.thirdTitle}" by ${data.thirdAuthor}`,
            date: moment().format('YYYY-MM-DD'),
        };

        // Check if the item array exists, if not initialize it as an empty array
        if (!Array.isArray(feed.rss.channel[0].item)) {
            feed.rss.channel[0].item = [];
        }
        feed.rss.channel[0].item.push(newTop);
        const builder = new xml2js.Builder();
        const updatedFeed = builder.buildObject(feed);
        fs.writeFileSync('../views/rss/rssfeed.xml', updatedFeed, 'utf8');
        console.log("update done");
    })
}

function addNewBookToFeed(book) {
    const xmlData = fs.readFileSync('../views/rss/rssfeed.xml', 'utf8');

    xml2js.parseString(xmlData, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const feed = result;
        const newTop = {
            title: `A new book has been added!`,
            description: `"${book.title}" by ${book.author} is available on Boo now!`,
            date: moment().format('YYYY-MM-DD'),
        };

        // Check if the item array exists, if not initialize it as an empty array
        if (!Array.isArray(feed.rss.channel[0].item)) {
            feed.rss.channel[0].item = [];
        }
        feed.rss.channel[0].item.push(newTop);
        const builder = new xml2js.Builder();
        const updatedFeed = builder.buildObject(feed);
        fs.writeFileSync('../views/rss/rssfeed.xml', updatedFeed, 'utf8');
        console.log("update done");
    })
}
//     feed.addItem({
//         title: `New Review for book: ${review.bookTitle}`,
//         description: `Review of ${review.stars} made by user ${review.username} : ${review.content}`,
//         date: review.date,
//         author: {
//             name: review.username
//         }
//     });
// }

module.exports = {
    addReviewToFeed,
    addTopChangeToFeed,
    addNewBookToFeed,
    addToRss
}