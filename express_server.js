const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

function generateRandomString() {
  let result = '';
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const possibleCharsLength = possibleChars.length;
  for (let i = 0; i < 6; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * possibleCharsLength));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" // for (let url in urls) --> 9sm5xK = url --> value is google.com (urls)
};

// homepage
app.get('/', (req, res) => {
  res.send('Hello there, and welcome!');
});

// urls list
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => { //specificity!!??
  res.send(generateRandomString());
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// get info...?
app.get('/urls/:shortURL', (req, res) => { //.get called route or route handler
  console.log(req);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World!</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`)
});
