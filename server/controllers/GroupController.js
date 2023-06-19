const groupRepository = require('../repositories/GroupRepository');
const jwt = require('jsonwebtoken');
const {parse} = require("cookie");
const userRepository = require("../repositories/UserRepository");
const {AuthenticationModel} = require("../models/AuthenticationModel");
const {joinGroup} = require("../repositories/GroupRepository");

function getStringJson(text){
    var json = {}, text = text.split("&");
    for (let i in text){
        let box = text[i].split("=");
        json[box[0]] = box[1];
    }
    return JSON.stringify(json);
}
const getMyGroups = async (req, res) =>{
    console.log("group controller");
   // Extract cookies from the client's request
    const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
    const user = jwt.verify(cookies.access_token, `${process.env.ACCESS_TOKEN_SECRET}`)
    const username = user.user.username;
    const userId = user.user.ID;

    console.log(username);
    try {
        const groups = await groupRepository.getMyGroups(userId);
        console.log(groups);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(groups));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const getGroup = async (req, res, name) =>{
    console.log("group controller: getGroup");
    try {
        const groups = await groupRepository.getGroupByName(name);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(groups));
        console.log(groups);
    } catch (error) {
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const joinGroupByInviteCode = async (req, res) =>{
    console.log("group controller: joinGroupByInviteCode");
    const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
    const user = jwt.verify(cookies.access_token, `${process.env.ACCESS_TOKEN_SECRET}`)
    const username = user.user.username;
    const userId = user.user.ID;

    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            console.log(body);
        });
        req.on('end', async () => {
            try {
                // console.log(`body: ${body}`);
                // const jsonString = getStringJson(body);
                // console.log(`jsonString: ${jsonString}`);
                const requestData = JSON.parse(body);
                console.log(`requestData: ${requestData}`);
                const inviteCode = requestData.inviteCodeForJoin;
                console.log(`inviteCode: ${inviteCode}`);

                const group = await groupRepository.getGroupByInviteCode(inviteCode);
                await groupRepository.joinGroup(userId, group.id);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(group));
                console.log(group);
            }
            catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) { ///as vrea sa fac verific in getGroupByInviteCode ceva eroare predefinita pe care s o verific aici sa trimit 404
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

const createGroup = async (req, res) =>{
    console.log("group controller: createGroup");
    const cookies = req.headers.cookie ? parse(req.headers.cookie, '; ') : {};
    const user = jwt.verify(cookies.access_token, `${process.env.ACCESS_TOKEN_SECRET}`)
    const userId = user.user.ID;
    const username = user.user.username;
    console.log(userId);
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            console.log(body);
        });
        req.on('end', async () => {
            try {
                // console.log(`body: ${body}`);
                // const jsonString = getStringJson(body);
                // console.log(`jsonString: ${jsonString}`);
                const requestData = JSON.parse(body);
                console.log(`requestData.name: ${requestData.newGroupName}`);
                const group = await groupRepository.insertGroup(requestData.newGroupName, userId);
                console.log(`group.id: ${group.id}`);
                await joinGroup(userId, group.id);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(group));
            }
            catch (error) {
                console.log(error);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Internal Server Error'}));
            }
        });
    } catch (error) { ///as vrea sa fac verific in getGroupByInviteCode ceva eroare predefinita pe care s o verific aici sa trimit 404
        console.log(error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

module.exports = {
    getMyGroups,
    getGroup,
    joinGroupByInviteCode,
    createGroup
}