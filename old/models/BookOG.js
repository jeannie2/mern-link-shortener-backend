const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  /*title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  published_date: {
    type: Date,
  },

  updated_date: {
    type: Date,
    default: Date.now,
  }, */
  /* publisher: {
    type: String,
  }, */
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
  /* shortUrl: {
    type: String,
    required: true,
  } */
});

module.exports = Book = mongoose.model('book', BookSchema);
