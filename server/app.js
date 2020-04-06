const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes');
const Err = require('./middlewares/err');

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(Err.handler);

app.listen(3000)