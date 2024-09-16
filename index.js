require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns')
const app = express();

let shortened = []

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/reset', (req, res) => {
  shortened = []
})

app.get('/api/shorturl/exampleset', (req, res) => {
  shortened = [
    'https://google.com/',
    'https://youtube.com'
  ]
})

app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let url = new URL(req.body.url);



  dns.lookup(url.hostname, (err, address, family) => {
    if (err != null) {
      res.json({ error: 'invalid url' })
      return console.error('invalid address: \n' + err)
    }

    shortened.push(url.href)
    let resobj = { original_url: url.href, short_url: shortened.length };
    res.json(resobj);
  })
});

app.get('/api/shorturl/:id', (req, res) => {
  let id = Number(req.params['id']);
  let url = shortened[id - 1];
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
