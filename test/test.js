var path = require("path");
const rootpath = path.dirname( process.cwd() );
var fcrypt = require(path.join( rootpath, "/index" ));
var clear = require("./clear");

function encrypt() {
  fcrypt.encrypt({
    key: "mySuperPass1337",
    input: path.join( rootpath, "/test/data/private" ),
    output: path.join( rootpath, "/test/data/dest/private.data" ),
    callback: (errors) => {
      if (errors.exists) {
        errors.console();
        return;
      }
      console.log("encrypted");
    }
  });
}
function decrypt() {
  fcrypt.decrypt({
    key: "mySuperPass1337t",
    input: path.join( rootpath, "/test/data/dest/private.data" ),
    output: path.join( rootpath, "/test/data/output" ),
    callback: (errors) => {
      if (errors.exists) {
        errors.console();
        return;
      }
      console.log("decrypted");
    }
  });
}

clear("./data/dest"); clear("./data/output");
// encrypt();
// decrypt();