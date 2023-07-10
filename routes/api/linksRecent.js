// await?
// res.send vs res.json
// check other methods for redirection in books
// Does order of routes matter? *
// react router vs express router
// if 2 ppl paste same link, wil be diff links for each person (tho direct to same page)

const express = require('express');
const router = express.Router();
const morgan = require("morgan"); // added. need both ??
const bodyParser = require('body-parser'); // added
const shortid = require("shortid");
const validUrl = require('valid-url')

const app = express(); //added
const Book = require('../../models/Book');

app.use(morgan("tiny")); // added

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

// router.get('/test', (req, res) => res.send('book route testing!'));

router.get('/all', (req, res) => { // HOME before. remove when finish
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json({ nobooksfound: 'No links found' }));
});

router.get('/show/:id', (req, res) => { // async, await here?
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ nobookfound: 'No linkk found' }));
});

// router.get('/:id', (req, res) => {
//   Book.findById(req.params.id)
//     .then((book) => res.json(book))
//     .catch((err) => res.status(404).json({ nobookfound: 'No Book found' }));
// });

 // res.status(302).redirect('/');
 // res.redirect(301, '/test');
router.get('/:urlId', (req, res) => {
  console.log("req.params.urlId: " + req.params.urlId)
  // Book.findById(req.params.urlId)
  Book.findOne({urlId: req.params.urlId})
    .then((book) => res.json(book)) // logs howdy with both urlId and id.
    .catch((err) => res.status(404).json({ nobookfound: 'No link found' }));
});

router.post('/', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const base = `http://localhost:3002`;
  const urlId = shortid.generate();
  console.log("originalUrl: " + originalUrl);

  if (validUrl.isUri(originalUrl)) {
    // res.send("passed")
    try {
      // let url = await Book.findOne({ originalUrl });
      /* if (url) {
          res.json(url);
        } else { */
          const data = req.body;
          const shortUrl = `${base}/${urlId}`;

          url = new Book({
            ...data,
            shortUrl,
            urlId
          });

        await url.save();
          res.json({
            url: url,
            id: url._id // how stored in mongodb
          });

          // book added successfully msg ??
      // }
      } catch (err) {
        console.log(err);
        res.status(500).json('Server error');
      }
    } else {
      res.status(400).json('Invalid original url, please try again');
    }
})

router.put('/:id', async (req, res) => {
  console.log("req.body.urlId: " + req.body.urlId) // req.params.urlId undefined
  console.log("req.param.id " + req.params.id) // works
  // console.log("req.body.shortUrl: " + req.body.shortUrl) // works

  let urlId = req.body.urlId
  let checkUser = await Book.exists({ urlId: req.body.urlId})

  if(checkUser) {
    console.log("already exists")
    // how to pass error message to react
    return res.status(400).json({msg: "Fail, please choose a different link"});
  } else  {
    console.log("new entry (previous field overwritten)");
    // }
    const base = `http://localhost:3002`;
    const shortUrl = `${base}/${req.body.urlId}`;

    Book.findByIdAndUpdate(
      {_id: req.params.id},
      {
        urlId: req.body.urlId,
        shortUrl: shortUrl
      },
      {
        new: true
      })
      .then((book) => res.json({ msg: 'Updated successfully' }))
      .catch((err) =>
        res.status(400).json({ error: 'Unable to update the Database' })
      )
  }
})

/*
router.delete('/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id, req.body)
    .then((book) => res.json({ mgs: 'Book entry deleted successfully' }))
    .catch((err) => res.status(404).json({ error: 'No such a book' }));
}); */

module.exports = router;
