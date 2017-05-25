# fcrypt
### v1.0.0 ( last update: 25 may 2017 )

Encryption and decryption files and folders.

### Install
```javascript
npm i fcrypt --save-dev
```

### Node.js
```javascript
var fcrypt = require("fcrypt");
```

### Encrypt
```javascript
fcrypt.encrypt({
  key: "mySuperPass1337",
  input: "./private",
  output: "./dest/private.data",
  callback: () => {
    console.log("encrypted");
  }
});
```

### Decrypt
```javascript
fcrypt.decrypt({
  key: "mySuperPass1337",
  input: "./dest/private.data",
  output: "./output",
  callback: () => {
    console.log("decrypted");
  }
});
```