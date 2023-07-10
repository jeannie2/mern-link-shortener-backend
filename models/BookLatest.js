const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
  },
  urlId: {
    type: String,
  },
});

module.exports = Book = mongoose.model('book', BookSchema);
