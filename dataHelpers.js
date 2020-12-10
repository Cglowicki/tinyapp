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
      return user;
    }
  }
};

module.exports = { generateRandomString, emailLookup };