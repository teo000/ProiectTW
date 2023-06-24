const fs = require("fs");
const {sendErrorResponse} = require ("../helpers");
const ejs = require ("ejs");
const groupsPromises =  require('../promises/GroupsPromises')
const customReadMyGroupsEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';

        const groupPromise = groupsPromises.getMyGroups(cookies);

        try {
            const [groupsData] = await Promise.all([groupPromise]);
            console.log(groupsData);
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {groups: groupsData});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}
const customReadAllGroupsEjs = async (req, res, file_path) => {
    if (fs.existsSync(file_path)) {
        const template = fs.readFileSync(file_path, "utf8");
        if (!template) {
            sendErrorResponse(res);
            return;
        }

        const cookies = req.headers.cookie || '';
        const groupPromise = groupsPromises.getAllGroups(cookies);

        try {
            const [groupsData] = await Promise.all([groupPromise]);
            console.log(groupsData);
            // Render the EJS template with the data
            const renderedEJS = ejs.render(template, {groups: groupsData});

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(renderedEJS);
        } catch (error) {
            console.log(error);
            sendErrorResponse(res);
        }
    }
}

const customReadGroupEjs = async (req, res, filepath, group) => {
    const template = fs.readFileSync(filepath, "utf8");
    if (!template) {
        sendErrorResponse(res);
        return;
    }

    const cookies = req.headers.cookie || '';

    const groupPromise =groupsPromises.getGroupPage(cookies, group);

    const membersPromise = groupsPromises.getGroupMembers(cookies, group);

    try {
        const [groupData, membersData] = await Promise.all([groupPromise, membersPromise]);
        console.log(groupData);
        // Render the EJS template with the data
        const renderedEJS = ejs.render(template, {group: groupData, members: membersData});

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(renderedEJS);
    } catch (error) {
        console.log(error);
        sendErrorResponse(res);
    }
}
module.exports = {
    customReadMyGroupsEjs,
    customReadAllGroupsEjs,
    customReadGroupEjs
}