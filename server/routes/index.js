const router = require('express').Router();
const userController = require('../controllers/userController');
const foodController = require('../controllers/foodController');
const auth = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/foods', auth.authorize, foodController.add);
router.get('/foods', auth.authorize, foodController.get);
router.delete('/foods/:id', auth.authorize, auth.authenticateFoods, foodController.delete);

module.exports = router;