const { assert } = require('chai');

const { emailLookup } = require('../dataHelpers.js');

const users = {
  "84Yu54": {
    id: "84Yu54",
    email: "shababa@cat.com",
    password: "shababa"
  },
  "OnF68t": {
    id: "OnF68t",
    email: "maisy@cat.com",
    password: "maisy"
  }
};

describe('emailLookup', function() {
  it ('should return a user with a valid email', function() {
    const user = emailLookup('shababa@cat.com', users);
    const expectedOutput = '84Yu54';
    assert.equal(user.id, expectedOutput);
  });

  it ('should return undefined if no user with the email is found', function() {
    const user = emailLookup('', users);
    assert.isUndefined(user);
  });

});