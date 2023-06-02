const {AuthenticationModel} = require('./AuthenticationModel')

class User {
    constructor(ID, username, email, passwordHash, salt) {
        this.ID = ID;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.salt = salt;
    }

}

module.exports = {
    User,
};