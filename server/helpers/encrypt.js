require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.BCRYPT_SALT);

class Encrypt {
    static hashPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                err ? reject(err) : resolve(hash);
            });
        })
    }
    static comparePassword(plainPassword, hashPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashPassword, function (err, result) {
                err ? reject(err) : resolve(result);
            });
        })
    }
}

module.exports = Encrypt;