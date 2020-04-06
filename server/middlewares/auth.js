require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const Err = require('../middlewares/err');
const { Food } = require('../models');

class Auth {
    static authorize(req, res, next) {
        const { access_token } = req.headers;
        // console.log('AT', access_token, jwtSecret)
        jwt.verify(access_token, jwtSecret, function (err, decoded) {
            if (err) throw new Err({
                name: 'InvalidAccessToken',
                status: 401,
                message: 'Invalid access token'
            })
            else {
                req['decoded'] = decoded;
                console.log(decoded)
                next()
            }
        });
    }
    static authenticateFoods(req, res, next) {
        const { decoded: { UserId }, params: { id } } = req;
        Food.findOne({ where: { id, UserId } })
            .then((food) => {
                if (!food) throw new Err({
                    name: 'Unauthorized',
                    status: 401,
                    message: 'You are not authorized'
                })
                else
                    next();
            })
            .catch(next)
    }
}

module.exports = Auth;