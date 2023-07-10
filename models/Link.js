const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
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

module.exports = Link = mongoose.model('link', LinkSchema);
