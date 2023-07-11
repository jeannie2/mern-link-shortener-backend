const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
const links = require('./routes/api/links');

connectDB();
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('home page'));

app.use('/api/links', links);

// app.get('/:urlId', (req, res) => res.send('Hello urlId world!'))

// app.get('/:urlId', (req, res) => {
//   res.send(`{req.params.urlId}`);
// });

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
