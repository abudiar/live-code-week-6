const { Food } = require('../models');
const Err = require('../middlewares/err');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

class FoodController {
    static add(req, res, next) {
        const {
            decoded: { UserId },
            body: { title, price, ingredients, tag }
        } = req;
        if (Err.isEmpty(title) || Err.isEmpty(price) || Err.isEmpty(ingredients) || Err.isEmpty(tag))
            throw new Err({
                name: 'IsEmpty',
                status: 400,
                message: 'Title, price, ingredients and tag are required'
            })
        if (!Number(price)) {
            throw new Err({
                name: 'ValidationError',
                status: 400,
                message: 'Price must be a number'
            })
        }
        Food.findOne({ where: { title, price, ingredients, tag } })
            .then((food) => {
                if (!food) {
                    return Food.create({ title, price, ingredients, tag, UserId })
                }
                throw new Err({
                    name: 'ExistsError',
                    status: 400,
                    message: 'Food already exists'
                })
            })
            .then((food) => {
                res.status(201).json({
                    title, price, ingredients, tag, UserId
                })
            })
            .catch(next);
    }
    static get(req, res, next) {
        const {
            decoded: { UserId }
        } = req;
        Food.findAll({ where: { UserId } })
            .then((foods) => {
                res.status(200).json(foods);
            })
            .catch(next);
    }
    static delete(req, res, next) {
        const {
            decoded: { UserId },
            params: { id }
        } = req;
        Food.findOne({ where: { id, UserId } })
            .then((food) => {
                food.destroy();
                res.status(200).json({ message: 'Successfully deleted food from your menu' })
            })
            .catch(next);
    }
}

module.exports = FoodController;