// show book list on edit page should just go back to previous book details show page
// hide list all functionality
// home should be create new link form
const express = require('express');
const router = express.Router();
const shortid = require("shortid");
const morgan = require("morgan"); //added
const bodyParser = require('body-parser');//added
const validUrl = require('valid-url')

const app = express(); //added
// const utils = require("../../Util/util");

// Load Book model
const Book = require('../../models/Book');

app.use(morgan("tiny")); //added

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

// @route GET api/books/test
// @description tests books route
// @access Public
// router.get('/test', (req, res) => res.send('book route testing!'));

// router.get('/short', (req, res) => res.send('shortest route testing!'));
// router.get('/short/:urlId', (req, res) => res.send(req.params.urlId));

router.get('/all', (req, res) => { // was HOME before. remove
// router.get('/', (req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
});

// redirect endpoint: from myurl-back
router.get('/test', (req, res) => {
  console.log("PARAM" + req)
  //let fellow = await
  // Book.findOne({urlId: "req.params.urlId"}) // works
  Book.findOne({urlId: "software"}) // works
  //if(fellow)
  .then((docs)=> {
    console.log("matching doc: ", docs)
    // console.log(req.params.urlId)
    console.log(docs.originalUrl)
    res.json(docs)
    // res.send(docs) // also works. which one???
  })
  .catch((err)=> {
    console.log(err)
  })

 // res.status(302).redirect('/');
 // return res.status(400).json({
//     msg: "Fail, please choose a different link"});
//  res.redirect(301, '/test');
// console.log("reipe" + res)
// res.send('short cut')
// return res.json({ msg: 'Updated successfully' })
// return res.redirect('/');
})

// @route GET api/books
// @description Get all books
// @access Public
// router.get('/', (req, res) => {
//   Book.find()
//     .then((books) => res.json(books))
//     .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
// });

// @route GET api/books/:id
// @description Get single book by id
// @access Public
// what is this
// router.get('/:id', (req, res) => {
//   Book.findById(req.params.id)
//     .then((book) => res.json(book))
//     .catch((err) => res.status(404).json({ nobookfound: 'No Book found' }));
// });

router.get('/show/:id', (req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ nobookfound: 'No linkk found' }));
});

router.get('/:urlId', (req, res) => {
  console.log("req.params.urlId: " + req.params.urlId)
  // Book.findById(req.params.urlId)
  Book.findOne({urlId: req.params.urlId})
    .then((book) => res.json(book)) // logs howdy with both urlId and id.
    .catch((err) => res.status(404).json({ nobookfound: 'No link found' }));
});

// router.get('/:urlId', (req, res) => {
//   res.send('CHUK CHUK')
//   console.log("CHUKCHUK")
//   console.log(req.params.urlId)
// });

// @route GET api/books
// @description add/save book
// @access Public
/*router.post('//erh', (req, res) => {
  console.log("Req: " + req)
  Book.create(req.body)
    .then((book) => res.json({ msg: 'Book added successfully' }))
    .catch((err) => res.status(400).json({ error: 'Unable to add this book' }));
}); */

router.post('/', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const base = `http://localhost:3002`;

  const urlId = shortid.generate();

  // console.log("req.body: " + req.json()); // worked when had publisher too, now just [object object]
  console.log("originalURL: " + originalUrl);

  // console.log("VALIDATION RESULTS" + utils.validateUrl(originalUrl)) //return err msg

// if(validUrl.isUri(originalUrl)) {
//   console.log("true pig")
// } else if (!validUrl.isUri(originalUrl)) {
//   console.log("false pig")
// }

/* const isValidUrl = urlString=> {
		let url;
		try {
      url =new URL(urlString);
    }
    catch(e){
      return false;
    }
	   // return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "www";
	}

console.log("method" + isValidUrl(originalUrl)) */

if (validUrl.isUri(originalUrl)) {
// if (utils.validateUrl(originalUrl)) {
// if (utils.validateUrl(originalUrl)) {
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
        // res.json(url);
        res.json({
          url: url,
          id: url._id //how stored in mongodb
        });

     // }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid original url, please try again');
  }
})

// @route GET api/books/:id
// @description Update book
// @access Public
// router.put('/:id', (req, res) => {
/* router.put('/:id', async (req, res) => {
  let url = await Book.findOne(req.body);
  if (url) {
    return res.status(400).json({
      msg: "Fail, please choose a different link"});
  }
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ msg: 'Updated successfully' }))
    .catch((err) =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
}); */

router.put('/:id', async (req, res) => {
  console.log("req.body.urlId: " + req.body.urlId) // req.params.urlId undefined
  // console.log("req.body.shortUrl: " + req.body.shortUrl) // works
  // console.log(req.params.urlId)
  console.log("req.param.id " + req.params.id) // works
  // console.log("req body " + req.body.urlId)
  let urlId = req.body.urlId

  // let checkUser = await Book.findOne({urlId: req.body.urlId})
  let checkUser = await Book.exists({ urlId: req.body.urlId})
  if(checkUser) {
    console.log("already exists")
    // how to pass error message to react
    return res.status(400).json({
      msg: "Fail, please choose a different link"});
  } else  {
    console.log("new entry");
  //}
  const base = `http://localhost:3002`;
  const shortUrl = `${base}/${req.body.urlId}`;

  // Book.findOneAndUpdate({$set: {urlId: req.body.urlId}})
  // Book.findOneAndUpdate({$set: {urlId: req.body.urlId}})
  // Book.findOneAndUpdate({$set: {urlId: req.body.urlId, shortUrl: req.body.shortUrl}})
  // Book.findOneAndUpdate({$set: {urlId: req.body.urlId, shortUrl: base + req.body.urlId}})
  // Book.findByIdAndUpdate(req.params.id, req.body.urlId)

  Book.findByIdAndUpdate(
    {_id: req.params.id},
    {
      urlId: req.body.urlId,
      shortUrl: shortUrl
    },
    {
      new: true
    })
    //(req.params.id, req.body.urlId)
  //  Book.findByIdAndUpdate(req.params.id, req.body.urlId)
    /* Book.findByIdAndUpdate(req.params.id, {
      $set: {
        urlId: req.body.urlId,
        shortUrl: `${base}/${req.body.urlId}`
      },
    }) */
    .then((book) => res.json({ msg: 'Updated successfully' }))
    .catch((err) =>
      res.status(400).json({ error: 'Unable to update the Database' })
    )
}
})

app.get('/shortie/:urlId', (req, res) => {
  Book.findOne({urlId: req.params.urlId}) // works
  .then((docs)=> {
    console.log("matching doc: ", docs)
    // return the full url
  })
  .catch((err)=> {
    console.log(err)
  })
});

router.get('/short', (req, res) => res.send('short route testing!'));

// redirect endpoint: from myurl-back
router.get('/shortx', (req, res) => {
 // res.status(302).redirect('/');
 // return res.status(400).json({
//     msg: "Fail, please choose a different link"});
//  res.redirect(301, '/test');
//  console.log("reipe" + res)
res.send('book route testing!')
// return res.json({ msg: 'Updated successfully' })
// return res.redirect('/');
})

router.get("/shortie", async (req, res) => {
  // return
  res.redirect(301, '/');
  // return res.redirect(url.originalUrl);
 /* try {
    // const url = await Book.findOne({ urlId: req.params.urlId });
    const url = await Book.exists({ urlId: req.params.urlId})
    console.log("URL" + url)
    // if(checkUser) {
    // console.log("GLOBE: " + url.docs)
    // await Book.findOne({urlId: req.body.urlId})
    // console.log(url)
    if (url) {
      // url.clicks++;
      // url.save(); ???
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  } */
});

/*
// @route GET api/books/:id
// @description Delete book by id
// @access Public
router.delete('/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id, req.body)
    .then((book) => res.json({ mgs: 'Book entry deleted successfully' }))
    .catch((err) => res.status(404).json({ error: 'No such a book' }));
}); */


module.exports = router;


// PUT: UPDATE

/*
  Book.findOne({urlId: req.body.urlId}) // works
  .then((docs)=> {
    console.log("matching doc: ", docs)
  })
  .catch((err)=> {
    console.log(err)
  }) */

  // let checkUser = await Book.exists({ urlId: req.params.urlId });
  // let checkUser = await Book.exists({ urlId: req.body.urlId }); // not req.body or complains cast error
  //await Url.findOne({ urlId: req.params.urlId });
  //let checkUser = await Book.findOne({ urlId: req.params.urlId });
  //console.log(checkUser)
  // let checkUser = await Book.exists({ shortUrl: req.body.shortUrl });
  // console.log("checkUser" + checkUser) // true
  /* if (checkUser) {
    return res.status(400).json({
      msg: "Fail, please choose a different link"});
  } else { */
