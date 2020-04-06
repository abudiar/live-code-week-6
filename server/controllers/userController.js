const { User } = require('../models');
const Encrypt = require('../helpers/encrypt');
const Err = require('../middlewares/err');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

class UserController {
    static register(req, res, next) {
        const { email, password } = req.body;
        User.findOne({ where: { email } })
            .then((user) => {
                if (!user) {
                    return Encrypt.hashPassword(password);
                }
                throw new Err({
                    name: 'UserExists',
                    status: 400,
                    message: 'User already exists'
                });
            })
            .then((password) => {
                return User.create({ email, password });
            })
            .then((user) => {
                res.status(201).json({ id: user.id, email: user.email });
            })
            .catch(next);
    }

    static login(req, res, next) {
        const { email, password } = req.body;
        let userData;
        User.findOne({ where: { email } })
            .then((user) => {
                if (!user) {
                    throw new Err({
                        name: 'CredsInvalid',
                        status: 400,
                        message: 'Credentials are invalid'
                    });
                }
                userData = user;
                return Encrypt.comparePassword(password, user.password);
            })
            .then((result) => {
                if (result) {
                    let access_token = jwt.sign({
                        id: userData.id,
                        email: userData.email
                    }, jwtSecret);
                    res.status(200).json({ access_token });
                }
                else {
                    throw new Err({
                        name: 'CredsInvalid',
                        status: 400,
                        message: 'Credentials are invalid'
                    });
                }
            })
            .catch(next);
    }
}

module.exports = UserController;