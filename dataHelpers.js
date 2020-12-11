// generate UID
const generateRandomString = function() {
  let result = '';
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const possibleCharsLength = possibleChars.length;
  for (let i = 0; i < 6; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * possibleCharsLength));
  }
  return result;
};

const emailLookup = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

const userURL = function(id, urlDatabase) {
  
  let urlPair = {};
  
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID == id) {
      urlPair[url] = { longURL: urlDatabase[url].longURL, userID: id };
    };
  }
  return urlPair;
};

module.exports = { generateRandomString, emailLookup, userURL };