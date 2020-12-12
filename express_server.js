// setup && file imports
const express = require('express');
const app = express();
const PORT = 8080;
const dataHelpers = require('./dataHelpers.js');
const { userURL } = require('./dataHelpers.js');

// middleware
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const morgan = require('morgan');
app.use(morgan('dev'));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['onekey']
}));

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`);
});

// database info
const users = {
  "84Yu54": {
    id: "84Yu54",
    email: "shababa@cat.com",
    password: bcrypt.hashSync("shababa", 2)
  },
  "OnF68t": {
    id: "OnF68t",
    email: "maisy@cat.com",
    password: bcrypt.hashSync("maisy", 2)
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "84Yu54" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "OnF68t" }
};

// route handlers
app.get('/', (req, res) => {
// render homepage
  const id = req.session['id'];
  const user = users[id];
  const templateVars = { user };
  res.render('homepage', templateVars);
});

app.get('/urls', (req, res) => {
// render urls specific to user
  const id = req.session['id'];
  const user = users[id];
  const myURLS = userURL(id, urlDatabase);

  const templateVars = {
    user,
    urls: myURLS
  };
  
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {

  const id = req.session['id'];
  const user = users[id];

  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  res.render('register', templateVars);
});

app.get('/login', (req, res) => {

  const id = req.session['id'];
  const user = users[id];
  const templateVars = { user };
  
  res.render('login', templateVars);
});

app.get('/urls/new', (req, res) => {
    
  const id = req.session['id'];
  const user = users[id];
  // only logged in users have permission
  if (id === undefined) {
    res.redirect('/login');
  }

  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {

  const id = req.session['id'];
  const user = users[id];
    // only logged in users have permission
    if (id === undefined) {
      res.redirect('/login');
    }

  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {

  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get('/urls.json', (req, res) => {

  res.json(urlDatabase);
});

app.post('/urls', (req, res) => {
  
  const userID = req.session['id'];
  const longURL = req.body.longURL;
  const shortURL = dataHelpers.generateRandomString();
  // user specific object formed in users database
  urlDatabase[shortURL] = {longURL, userID};
  
  res.redirect(`urls/${shortURL}`);
});

app.post('/register', (req, res) => {
  
  const id = dataHelpers.generateRandomString();

  const email = req.body.email;
  const password = req.body.password;
  const hashPass = bcrypt.hashSync(password, 2);

  // emailLookup() looping through user object, see dataHelpers.js
  if (email === '' || password === '') {
    return res.status(400).send('Whoops! One or more fields was left blank...');
  }
  if (dataHelpers.emailLookup(email, users)) {
    return res.status(400).send('Hmm... Looks like that email has been registered');
  }
  
  users[id] =  { id, email, password: hashPass };
  req.session.id = id;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {

  const password = req.body.password;
  const email = req.body.email;

  // emailLookup() returns user object, see dataHelper.js
  const userInfo = dataHelpers.emailLookup(email, users);
  
  if (bcrypt.compareSync(password, userInfo.password)) {
    req.session.id = userInfo.id;
    res.redirect('/urls');
  } else {
    return res.status(401).send('Wrong email or password, try again.');
  }
});

app.post('/logout', (req, res) => {
// logout redirects to homepage
  req.session = null;
  res.redirect('/');
});

app.post('/urls/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls`);
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
