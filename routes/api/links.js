const express = require('express');
const router = express.Router();
// const morgan = require("morgan"); // added. need both??
const bodyParser = require('body-parser'); // added
const shortid = require("shortid");
const validUrl = require('valid-url')

const app = express(); //added
const Link = require('../../models/Link');

// app.use(morgan("tiny")); // added

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

// router.get('/test', (req, res) => res.send('book route testing!'));

router.get('/show/:id', (req, res) => {
  Link.findById(req.params.id)
    .then((link) => res.json(link))
    .catch((err) => res.status(404).json({ nolinksfound: 'No link found' }));
});

router.get('/:urlId', (req, res) => {
  console.log("req.params.urlId: " + req.params.urlId)
  // Link.findById(req.params.urlId)
  Link.findOne({urlId: req.params.urlId})
    .then((link) => res.json(link)) // logs howdy with both urlId and id
    .catch((err) => res.status(404).json({ nolinkfound: 'No link found' }));
});

router.post('/', async (req, res) => {
  const originalUrl = req.body.originalUrl;
  const base = `http://localhost:3002`;

  // const base = `https://mern-link-shortener-backend.vercel.app`;
  const urlId = shortid.generate();
  console.log("originalUrl: " + originalUrl);

  if (validUrl.isUri(originalUrl)) {
    // res.send("passed")
    try {
          const data = req.body;
          const shortUrl = `${base}/${urlId}`;

          url = new Link({
            ...data,
            shortUrl,
            urlId
          });

        await url.save();
          res.json({
            url: url,
            id: url._id // how stored in mongodb
          });
          // link added successfully msg
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
  console.log("req.param.id " + req.params.id) // console.log("req.body.shortUrl: " + req.body.shortUrl) // works

  let urlId = req.body.urlId
  let checkUser = await Link.exists({ urlId: req.body.urlId})

  if(checkUser) {
    console.log("already exists")
    return res.status(400).json({msg: "Fail, please choose a different link"});
  } else  {
    console.log("new entry (previous field overwritten)");
    // }

    const base = `http://localhost:3002`;
    // const base = `https://mern-link-shortener-backend.vercel.app`
    const shortUrl = `${base}/${req.body.urlId}`

    Link.findByIdAndUpdate(
      {_id: req.params.id},
      {
        urlId: req.body.urlId,
        shortUrl: shortUrl
      },
      {
        new: true
      })
      .then((link) => res.json({ msg: 'Updated successfully' }))
      .catch((err) =>
        res.status(400).json({ error: 'Unable to update the Database' })
      )
  }
})

module.exports = router;
