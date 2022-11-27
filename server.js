const express = require('express');
const path = require('path')
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static('dist'));
console.log(path.resolve(__dirname, 'dist'));


app.listen(() => {
  console.log(`Server run on port ${port}`);
},)