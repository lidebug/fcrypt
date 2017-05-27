//fcrypt
//created by lidebug

var path = require("path");
var fs = require("fs");
var yazl = require("yazl");
var yauzl = require("yauzl");
var unzipper = require("unzipper");
var stream = require("stream");
var crypto = require("crypto");
var js = require("libraryjs");

var makedir = require("./makedir.js");
var Errors = require("./errors.js");

//Open all files and folder by path
function folderTree(treePath, callback, end) {
  var items = fs.readdirSync(treePath);
  for(itemName of items) {
    let itemPath = path.join(treePath, itemName);
    let isdir = fs.lstatSync( itemPath ).isDirectory();

    var type = {
      isdir: isdir,
      isfile: !isdir
    };
    callback(itemPath, type);
    if (isdir) folderTree(itemPath, callback);
  }
  if (js.is(end)) end();
}

function encrypt(param) {
  //include:
  //  param.key
  //  param.input
  //  param.output
  //  param.name
  //  param.callback
  //  param.method

  var errors = new Errors();

  //Default
  param.method = js.or(param.method, "aes-256-cbc");

  //Does input folder exist?
  if (!fs.existsSync(param.input)) {
    errors.addError("Input directory doesn't exist", 100);
    param.callback(errors);
    return;
  }

  //create output folder, if it doesn't exist
  makedir(path.dirname(param.output));

  //create ecryptor pipe
  try {
    var encrypt = crypto.createCipher(param.method, param.key);
  }
  catch (err) {

    if (err.message === "Unknown cipher") errors.addError("Incorrect method", 150);
    else if (err.message === "Key must be a buffer") errors.addError("Incorrect key", 151);
    else errors.addError("Crypto error", 152);
    
    param.callback(errors);
    return;
  }

  //zip class
  var zipfile = new yazl.ZipFile();

  //when ready encrypt and save
  zipfile.outputStream
    .pipe(encrypt)
    .pipe(fs.createWriteStream( param.output ))
    .on("close", () => {
      param.callback(errors);
    })
  ;

  //get files from input
  folderTree(param.input, (itemPath, type) => {
    var subpath = path.relative(param.input, itemPath);

    if (type.isdir) {
      //Directory:
      zipfile.addEmptyDirectory(subpath);
      return;
    }
    
    //File:
    zipfile.addReadStream(fs.createReadStream( itemPath ), subpath);
  }, () => zipfile.end() );
}

function decrypt(param) {
  //include:
  //  param.key
  //  param.input
  //  param.output
  //  param.callback
  //  param.method

  var errors = new Errors();

  //Default
  param.method = js.or(param.method, "aes-256-cbc");

  //Does input folder exist?
  if (!fs.existsSync(param.input)) {
    errors.addError("Input file doesn't exist", 101);
    param.callback(errors);
    return;
  }

  //create output folder, if it doesn't exist
  makedir(param.output);

  //create ecryptor pipe
  try {
    var encrypt = crypto.createCipher(param.method, param.key);
  }
  catch (err) {

    if (err.message === "Unknown cipher") errors.addError("Incorrect method", 150);
    else if (err.message === "Key must be a buffer") errors.addError("Incorrect key", 151);
    else errors.addError("Crypto error", 152);
    
    param.callback(errors);
    return;
  }

  //Decrypt and uncompress
  fs.createReadStream(param.input)
    .pipe(decrypt)
    .pipe(unzipper.Extract({ path: param.output }))
    .on("error", (err) => {
      errors.addError("Key is incorrect", 303);
      param.callback(errors);
    })
    .on("close", () => {
      param.callback(errors);
    });
  ;
}


module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}