const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const connectDB = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});

connectDB.connect((err) => {
  if (err) {
    console.log("Database Connect Error!", err);
  } else {
    console.log("MYSQL Database connection Successful!");
  }
});

module.exports = connectDB;
