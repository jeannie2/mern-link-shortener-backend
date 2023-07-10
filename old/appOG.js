const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors');

const app = express();

const books = require('./routes/api/books');

// Connect Database
connectDB();
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello home world!'));
// hello world before. keep?

app.get('/:urlId', (req, res) => res.send('Hello urlId world!')) // uncommented
// hello world before

// app.get('/short/:urlId', (req, res) => res.redirect(301, '/'))
// app.get('/shortie/:urlId', (req, res) => res.send('shortie world!'));

/* app.get('/short/:urlId', function (req, res) {
    res.redirect(301, 'https://www.geeksforgeeks.org/array-data-structure/');
}); */

// app.get('/api/books', books); include?

app.use('/api/books', books);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));