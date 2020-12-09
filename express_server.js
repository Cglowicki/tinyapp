// setup
const express = require('express');
const app = express();
const PORT = 8080;
const dataHelpers = require('./dataHelpers.js');

// middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const morgan = require('morgan');
app.use(morgan('dev'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// set view engine
app.set('view engine', 'ejs');

// port and database info
app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`)
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" // for (let url in urls) --> 9sm5xK = url --> value is google.com (urls)
};

// homepage stuff
app.get('/', (req, res) => {
  res.send('Hello there, and welcome!');
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World!</b></body></html>\n');
});

// urls list
app.get('/urls', (req, res) => { // check USERNAME!!!
  const templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase
  }
  console.log(req.cookies);
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => { 
  let shortURL = dataHelpers.generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`);
});

// new urls functionality

// urls info 
app.post('/login', (req, res) =>{ // check USERNAME!!!
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
  const templateVars = { 
    username: req.cookies['username']
  }
  res.render('urls_new', templateVars);
});


app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => { 
  const newLongURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = newLongURL;
  res.redirect('/urls');
});

app.get('/urls/:shortURL', (req, res) => { // check USERNAME!!!
  const templateVars = { 
    username: req.cookies['username'],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

