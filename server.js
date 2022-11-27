const express = require('express');
const path = require('path')
const port = process.env.PORT || 3000;

const app = express();

const dist = path.resolve(__dirname, 'dist');
app.use(express.static(dist));


app.listen(port)
console.log(`Server running on port ${port}`);
