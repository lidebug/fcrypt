# fcrypt
### v1.1.0 ( last update: 27 may 2017 )

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
  input: "./src/private",
  output: "./src/dest/private.data",
  callback: (errors) => {
    if (errors.error) {
      errors.console();
      return;
    }
    console.log("encrypted");
  }
});
```

### Decrypt
```javascript
fcrypt.decrypt({
  key: "mySuperPass1337",
  input: "./src/dest/private.data",
  output: "./src/output",
  callback: (errors) => {
    if (errors.exists) {
      errors.console();
      return;
    }
    console.log("decrypted");
  }
});
```

### Extra
You could change default crypto method
```javascript
fcrypt.encrypt({
  key: "mySuperPass1337",
  input: "./private",
  output: "./dest/private.data",
  method: "aes192", // <-- The one
  callback: () => {
    console.log("encrypted");
  }
});
```
Same thing in decrypt()