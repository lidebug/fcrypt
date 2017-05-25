var path = require("path");
var fs = require("fs");

function parsePath(fullpath) {
  var parse = path.parse(fullpath);
  var arrpath = [];
  if (parse.base) arrpath.push(parse.base);
  if ( parse.root === parse.dir ) return arrpath;

  var subpath = parsePath(parse.dir);
  arrpath = subpath.concat(arrpath);
  return arrpath;
}

function existTree(fullpath, callback) {
  var tree = parsePath(fullpath);
  var checkpath = path.parse(fullpath).root;
  for(let dir of tree) {
    checkpath = path.join( checkpath, dir);
    let exists = fs.existsSync(checkpath);
    callback(exists, checkpath);
  }
}

function makedirTree(fullpath) {
  existTree(fullpath, (exists, dirpath) => {
    if (exists) return;
    fs.mkdir(dirpath);
  });
}

module.exports = makedirTree;