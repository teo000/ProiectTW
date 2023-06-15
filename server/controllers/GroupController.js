const groupRepository = require('../repositories/GroupRepository');
const jwt = require('jsonwebtoken');
const {parse} = require("cookie");

const getMyGroups = async (req, res) =>{
    console.log("group controller");
   // Extract cookies from the client's request
    const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
    const user = jwt.verify(cookies.access_token, `${process.env.ACCESS_TOKEN_SECRET}`)
    const username = user.user.username;
    console.log(username);
    try {
        const groups = await groupRepository.getMyGroups(username);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(groups));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

module.exports = {
    getMyGroups
}