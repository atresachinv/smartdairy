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
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000,
  charset: "utf8mb4",
});




module.exports = pool;

