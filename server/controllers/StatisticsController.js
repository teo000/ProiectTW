const statisticsRepository = require('../repositories/StatisticsRepository')
const {getUsersWhoGaveMostReviews} = require("../repositories/StatisticsRepository");
async function getStatistics(req, res) {
    try {
        const booksWithMostRatings = await getBooksWithMostRatingsStatistic();
        const booksWithHighestRatings =await  getBooksWithHighestRatings()
        const usersWhoGaveMostReviews = await getUsersWhoGaveMostReviews();
        const allStatistics = {
            mostRatings: booksWithMostRatings,
            highestRatings: booksWithHighestRatings,
            mostReviewsGiven: usersWhoGaveMostReviews
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(allStatistics));
    } catch (error) {
        console.log(error);
        // res.writeHead(500, {'Content-Type': 'application/json'});
        // res.end(JSON.stringify({error: 'Internal Server Error'}));
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}
async function getBooksWithMostRatingsStatistic(req, res) {
     return await statisticsRepository.getBooksWithMostRatings();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));

}




async function getBooksWithHighestRatings() {
    return await statisticsRepository.getBooksWithHighestRatings();
}

async function usersWhoGaveMostReviews(){
    return await statisticsRepository.getUsersWhoGaveMostReviews();
}

 async function exportStatisticsToCsv(){
    const data = await getStatistics();

}

module.exports = {
    getStatistics
}