//fcrypt
//created by lidebug

var path = require("path");
var fs = require("fs");
var yazl = require("yazl");
var yauzl = require("yauzl");
var stream = require("stream");
var crypto = require("crypto");

var makedir = require("./makedir.js");

function encrypt(param) {
  //include:
  //  param.key
  //  param.input
  //  param.output
  //  param.name
  //  param.callback

  //create output folder, if it doesn't exist
  makedir(path.dirname(param.output));

  //create ecryptor pipe
  var encrypt = crypto.createCipher("aes256", param.key);

  //zip class
  var zipfile = new yazl.ZipFile();

  //when ready encrypt and save
  zipfile.outputStream
    .pipe(encrypt)
    .pipe(fs.createWriteStream( param.output ))
    .on("close", () => {
      param.callback();
    })
  ;
  
  //get files from input
  var items = fs.readdirSync(param.input);
  for (let itemname of items) {
    let itempath = path.join(param.input, itemname);

    let isdir = fs.lstatSync( itempath ).isDirectory();
    if (isdir) continue; //Just files for now...

    zipfile.addReadStream(fs.createReadStream( itempath ), itemname);
  }

  //ready
  zipfile.end();
}

function decrypt(param) {
  //include:
  //  param.key
  //  param.input
  //  param.output
  //  param.callback

  //create output folder, if it doesn't exist
  makedir(param.output);

  //create deryptor pipe
  var decrypt = crypto.createDecipher("aes256", param.key);

  //import file from archive
  var importEntry = (zipfile, entry) => {
    //full path to file
    var outputPath = path.join( param.output, entry.fileName);

    //delete file if it already exists
    if (fs.existsSync(outputPath)) fs.unlink(outputPath);

    //if it folder:
    if (/\/$/.test(entry.fileName)) return; //folders not available...

    //if it file:
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) throw err;
      readStream.on("end", () => {
        zipfile.readEntry();
      });
      readStream
        .pipe(fs.createWriteStream(outputPath))
      ;
    });
  };

  //decompress pipe
  var decompress = new stream.Transform();
  decompress._transform = (buffer, enc, cb) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;
      var totalFilesExported = 0; //How much files was exported
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        importEntry(zipfile, entry);
      });
      zipfile.on("end", () => param.callback() );
    });
  };

  //Open encrypted file, decrypt it and decompress
  fs.createReadStream(param.input)
    .pipe(decrypt)
    .pipe(decompress)
  ;
}


module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}