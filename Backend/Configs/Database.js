// const mysql = require("mysql");
// const dotenv = require("dotenv");
// dotenv.config({ path: ".env" });
//
// const connectDB = mysql.createConnection({
//   port: process.env.DB_PORT,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
//
// connectDB.connect((err) => {
//   if (err) {
//     console.log("Database Connect Error!", err);
//   } else {
//     console.log("MYSQL Database connection Successful!");
//   }
// });
//
// module.exports = connectDB;

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // 20 seconds
  acquireTimeout: 10000,
});

module.exports = pool;
