const {getStatistics} = require('../controllers/StatisticsController')
const handleRequests  = (req,res) =>{
    if(req.url.startsWith('/statistics')){
        getStatistics(req,res);
    }
}

module.exports = {
    handleRequests
}