const {AuthenticationModel} = require('./AuthenticationModel')

class User {
    constructor(ID, username, email, passwordHash, salt, isadmin) {
        this.ID = ID;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
        this.isadmin = isadmin;
    }
}

module.exports = {
    User,
};