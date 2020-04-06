const express = require('express')
const app = express()
const routes = require('./routes');
const Err = require('./middlewares/err');

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(Err.handler);

app.listen(3000)