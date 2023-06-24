const PORT = 8081;
const http = require("http");
const {getImagesUrl, getFileUrl, getScriptsUrl, getCssUrl, sendErrorResponse, customReadFile} = require('./helpers');
const {
    authenticateToken,
    authenticateTokenForAdmin,
    authenticateTokenForUser,
    extractUser
} = require("../helpers/TokenAuthenticator");
const {
    customReadBookRecommendations,
    customReadBooksByCriteriaEjs,
    customReadBooksEjs,
    customReadUserBooksEjs
} = require('./customReadEjs/CustomReadBookFiles')
const {customReadGenresEjs} = require('./customReadEjs/CustomReadGenreFiles')
const {
    customReadHomepageEjs,
    customReadUserEjs,
    customReadStatisticsEjs
} = require('./customReadEjs/CustomReadOtherFiles')
const {customReadUserForAdminEjs, customReadUsersEjs} = require('./customReadEjs/CustomReadAdminFiles')
const {
    customReadMyGroupsEjs,
    customReadAllGroupsEjs,
    customReadGroupEjs
} = require('./customReadEjs/CustomReadGroupFiles')

const server = http.createServer((req, res) => {

    const url = req.url;
    console.log(`front request: ${url}`);
    if (url.startsWith('/admin') && url.indexOf(".") === -1) {
        if (url === '/admin/homepage')
            authenticateTokenForAdmin(req, res, customReadHomepageEjs, `../views/ejs/adminhomepage.ejs`);
        else if (url === '/admin/groups/allgroups')
            authenticateTokenForAdmin(req, res, customReadAllGroupsEjs, `../views/ejs/adminallgroupspage.ejs`);
        else if (url.startsWith('/admin/groups/group/')) {
            const groupName = url.split('/')[4].toLowerCase();
            authenticateTokenForAdmin(req, res, customReadGroupEjs, `../views/ejs/admingrouppage.ejs`, groupName);
        } else if (url === '/admin/users')
            authenticateTokenForAdmin(req, res, customReadUsersEjs, `../views/ejs/adminuserspage.ejs`);
        else if (url.startsWith('/admin/books/genres?')) {
            const queryString = req.url.split('?')[1];
            const params = new URLSearchParams(queryString);
            const genre = params.get('genre');
            const pageSize = params.get('pageSize');
            const pageNumber = params.get('pageNumber');
            authenticateTokenForAdmin(req, res, customReadGenresEjs, `../views/ejs/admingenres.ejs`, genre, pageSize, pageNumber);
        } else if (url.startsWith('/admin/books/getBook/') && url.indexOf(".") === -1) {
            const title = url.split('/')[4].toLowerCase();
            // res.setHeader('Cache-Control', 'max-age=31536000')

            authenticateTokenForAdmin(req, res, customReadBooksEjs, `../views/ejs/adminbookpage.ejs`, title);
        } else if (url === '/admin/profile')
            authenticateTokenForAdmin(req, res, customReadUserEjs, `../views/ejs/adminuserprofile.ejs`);
        else if (url.startsWith('/admin/profile/')) {
            const username = url.split('/')[3].toLowerCase();
            authenticateTokenForAdmin(req, res, customReadUserForAdminEjs, `../views/ejs/adminuserprofile.ejs`, username);
        } else if (req.url.startsWith('/admin/books/criteria?'))
            authenticateTokenForAdmin(req, res, customReadBooksByCriteriaEjs, '../views/ejs/adminBooksByCriteria.ejs');
        else if (url === '/admin/statistics')
            authenticateTokenForAdmin(req, res, customReadStatisticsEjs, `../views/ejs/adminstatistics.ejs`);
        else if (url.indexOf("login") === -1 && url.indexOf("signup") === -1)
            authenticateTokenForAdmin(req, res, customReadFile, getFileUrl(url));
        else {
            //res.setHeader('Cache-Control', 'max-age=31536000')
            res.writeHead(200, {"Content-Type": "text/html"});
            customReadFile(req, res, getFileUrl(url));
        }
    } else if (url.startsWith('/books/genres?') && url.indexOf(".") === -1) {
        const queryString = req.url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const genre = params.get('genre');
        const pageSize = params.get('pageSize');
        const pageNumber = params.get('pageNumber');
        //res.setHeader('Cache-Control', 'max-age=31536000')
        authenticateTokenForUser(req, res, customReadGenresEjs, `../views/ejs/genres.ejs`, genre, pageSize, pageNumber);
        //   authenticateToken(req, res, customReadEjsFile,`../views/ejs/genres.ejs`,genre);
    } else if (url.startsWith('/books/getBook/') && url.indexOf(".") === -1) {
        // res.setHeader('Cache-Control', 'max-age=31536000')
        const id = req.url.split('/')[3];
        authenticateTokenForUser(req, res, customReadBooksEjs, `../views/ejs/bookpage.ejs`, id);
    } else if (url.startsWith('/profile') && url.indexOf(".") === -1) {
        // res.setHeader('Cache-Control', 'max-age=31536000')

        authenticateTokenForUser(req, res, customReadUserEjs, `../views/ejs/profile.ejs`);
    } else if (req.url.startsWith('/books/criteria?')) {
        authenticateTokenForUser(req, res, customReadBooksByCriteriaEjs, '../views/ejs/booksByCriteria.ejs');
    } else if (url.startsWith('/groups/mygroups') && url.indexOf(".") === -1) {
        authenticateTokenForUser(req, res, customReadMyGroupsEjs, '../views/ejs/mygroups.ejs');
    } else if (url.startsWith('/groups/group/') && url.indexOf(".") === -1) {
        const group = url.split('/')[3].toLowerCase();
        authenticateTokenForUser(req, res, customReadGroupEjs, `../views/ejs/grouppage.ejs`, group);
    } else if (url.startsWith('/books/mybooks/') && url.indexOf(".") === -1) {
        authenticateTokenForUser(req, res, customReadUserBooksEjs, `../views/ejs/mybooks.ejs`);
    } else if (url.startsWith('/recommendations') && url.indexOf(".") === -1) {
        authenticateTokenForUser(req, res, customReadBookRecommendations, `../views/ejs/recommendations.ejs`);
    } else if (url === '/homepage') {
        authenticateTokenForUser(req, res, customReadHomepageEjs, `../views/ejs/homepage.ejs`);
    } else if (url.startsWith('/statistics') && url.indexOf('.') === -1) {
        authenticateTokenForUser(req, res, customReadStatisticsEjs, `../views/ejs/statistics.ejs`);
    } else if (url.indexOf(".") === -1) {
        //its an html request
        //check if it is login
        if (url.indexOf("rss") !== -1) {
            authenticateToken(req, res, customReadFile, `../views/rss/rssfeed.xml`);
            return;
        }
        if (url.indexOf("login") === -1 && url.indexOf("signup") === -1 && url.indexOf("requestresetpassword") === -1) {
            //  res.writeHead(200, {"Content-Type": "text/html"});
            authenticateTokenForUser(req, res, customReadFile, getFileUrl(url));
            // customReadFile(req, res, getFileUrl(url));
            return;
        }
        //pt login si signup nu cer token
        res.setHeader('Cache-Control', 'max-age=31536000')
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadFile(req, res, getFileUrl(url));

    } else if (url.indexOf(".js") !== -1) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        customReadFile(req, res, getScriptsUrl(url));
    } else if (url.indexOf(".css") !== -1) {
        res.writeHead(200, {"Content-Type": "text/css"});
        customReadFile(req, res, getCssUrl(url));
    } else if (url.indexOf(".png") !== -1) {
        res.setHeader('Cache-Control', 'max-age=31536000')
        res.writeHead(200, {"Content-Type": "image/png"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".jpg") !== -1) {
        res.setHeader('Cache-Control', 'max-age=31536000')
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        customReadFile(req, res, getImagesUrl(url));
    } else if (url.indexOf(".ejs") !== -1) {
        //make request to server to get data
        res.writeHead(200, {"Content-Type": "text/html"});
        customReadGenresEjs(req, res, `../views/ejs/${url}`);
    } else sendErrorResponse(res);

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
