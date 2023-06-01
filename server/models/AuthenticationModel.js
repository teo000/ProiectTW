const bcrypt = require('bcrypt')
const saltRounds = 10;

class AuthenticationModel {
    constructor(password) {
        this.salt = bcrypt.genSaltSync(saltRounds);
        this.password = this.hashPassword(password)
    }

    hashPassword(password){
        return bcrypt.hashSync(password,this.salt)
    }
}

module.exports = AuthenticationModel;