const express = require('express');
const path = require('path')

const app = express();

app.use(express.static('dist'));
console.log(path.resolve(__dirname, 'dist'));


app.listen(3000)