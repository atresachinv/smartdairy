const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Route Imports
const user = require("./Routes/UserRoutes");
const milk = require("./Routes/MilkRoutes");
const cust= require("./Routes/CustomerRoutes");

app.use("/smartdairy/api", user);
app.use("/smartdairy/api", milk);
app.use("/smartdairy/api", cust);

module.exports = app;
