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

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}...`)
});

//database info
const users = {
  "84Yu54": {
    id: "84Yu54",
    email: "shababa@cat.com",
    password: "shababa" //bcrypt
  },
  "OnF68t": {
    id: "OnF68t",
    email: "maisy@cat.com",
    password: "maisy" //bcrypt
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com" // for (let url in urls) --> 9sm5xK = url --> value is google.com (urls)
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

  const templateVars = { 
    user,
    urls: urlDatabase
  }
  
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {

  const id = req.cookies['id'];
  const user = users[id];

  const templateVars = { 
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }

  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const id = req.cookies['id'];
  const user = users[id];
  const templateVars = { user };
  
  res.render('login', templateVars);
  //res.redirect('/urls');
});

app.get('/urls/new', (req, res) => {
    
  const id = req.cookies['id'];
  const user = users[id];
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

  if (dataHelpers.emailLookup(email, users)) {
    return res.status(400).send('Hmm... Looks like that email has been registered');
  }
  if (email === '' || password === '') {
    return res.status(400).send('Whoops! One or more fields was left blank...');
  }
  
  users[id] =  { id, email, password };
  res.cookie('id', id);
  res.redirect('/urls');
});

app.post('/login', (req, res) => { //implement pass auth

  const password = req.body.password;
  const email = req.body.email;
  const userInfo = dataHelpers.emailLookup(email, users);

  if (users[userInfo].password !== password) {
    return res.status(401).send('Wrong email or password, try again.');
  };

  res.cookie('id', userInfo);
  res.redirect('/urls');
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


//<div class="navbar-nav">