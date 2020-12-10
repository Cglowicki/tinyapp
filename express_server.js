// setup
const express = require('express');
const app = express();
const PORT = 8080;
const dataHelpers = require('./dataHelpers.js');


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

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { userURL } = require('./dataHelpers.js');

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`)
});

//database info
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

//route handlers
app.get('/', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];
  const templateVars = { user }
  res.render('homepage', templateVars);
});

app.get('/urls', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];
  const myURLS = userURL(id, urlDatabase);

  const templateVars = { 
    user,
    urls: myURLS
  };
  
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];

  const templateVars = { 
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  res.render('register', templateVars);
});

app.get('/login', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];
  const templateVars = { user };
  
  res.render('login', templateVars);
});

app.get('/urls/new', (req, res) => {
    
  const id = req.cookies['id'];
  const user = users[id];

  if (id === undefined) {
    res.redirect('/login');
  };

  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];

  const templateVars = { 
    user,
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

app.post('/urls', (req, res) => { 

  let shortURL = dataHelpers.generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`urls/${shortURL}`);
});

app.post('/register', (req, res) => {  // some stuff for error messages
  
  const id = dataHelpers.generateRandomString();

  const email = req.body.email;
  const password = req.body.password; //bcrypt
  const hashPass = bcrypt.hashSync(password, 2);

  if (dataHelpers.emailLookup(email, users)) {
    return res.status(400).send('Hmm... Looks like that email has been registered');
  }
  if (email === '' || password === '') { //may not be nothing with hash!!!!!!!!!!!
    return res.status(400).send('Whoops! One or more fields was left blank...');
  }
  
  users[id] =  { id, email, password: hashPass };
  res.cookie('id', id);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {

  const password = req.body.password; //bcrypt
  
  const email = req.body.email;
  const userInfo = dataHelpers.emailLookup(email, users);
  
  if (bcrypt.compareSync(password, userInfo.password)) {
    res.cookie('id', userInfo.id);
    res.redirect('/urls');
  } else {
    return res.status(401).send('Wrong email or password, try again.');
  }
});

app.post('/logout', (req, res) => {

  res.clearCookie('id');
  res.redirect('/urls');
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
