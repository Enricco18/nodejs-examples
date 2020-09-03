const express = require('express');
const path = require('path');
const hbs = require('hbs');

const router = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static('package.json'));
app.use(router);



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})

module.exports = app;