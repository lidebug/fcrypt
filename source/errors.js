var js = require("libraryjs");

class Errors {
  constructor() {
    var self = this;
    self.exists = false;
    self.errors = [];
  }
  addError(msg, code) {
    var self = this;

    if (js.not(msg)) {
      msg = "Unknown error";
      code = 104;
    }
    code = code || 204;

    self.exists = true;
    self.errors.push({
      message: msg,
      code: code
    });
  }
  checkError(code) {
    var self = this;

    for(let error of self.errors) {
      if (error.code === code) return true;
    }

    return false;
  }
  console() {
    var self = this;

    for(let error of self.errors) {
      console.log(error.message);
    }
  }
}

module.exports = Errors;

// 104 - Unknown error
// 204 - Every error