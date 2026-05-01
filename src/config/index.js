export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/simpleshop',
    options: {
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout for server selection
      socketTimeoutMS: 3000, // 3 seconds timeout for socket operations
    }
  },
  mysql: {
    uri: 'mysql://root:secret@localhost:3306/simpleshop',
      options: {
        logging: false, // Disable logging for MySQL
      }
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  session: {
    // Secret key to encrypt client side sessions.
    // Created on the terminal with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE="
  }
};
