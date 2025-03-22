const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Route Imports
const user = require("./Routes/UserRoutes");
const dairy = require("./Routes/DairyRoutes");
const ratechart = require("./Routes/RatechartRoutes");
const milk = require("./Routes/MilkRoutes");
const cust = require("./Routes/CustomerRoutes");
const emp = require("./Routes/EmpRoutes");
const bank = require("./Routes/BankRoutes");
const purchase = require("./Routes/PurchaseRoutes");
const payment = require("./Routes/PaymentRoutes");
const notify = require("./Routes/fireBaseRoutes");
const sales = require("./Routes/SalesRoutes");
const products = require("./Routes/ItemRoutes");
const stocks = require("./Routes/StockRoutes");
const stockitem = require("./Routes/ItemStockRoutes");
const deliverstock = require("./Routes/DeliveryStockRoutes");
const deduction = require("./Routes/DeductionRoutes");
const admin = require("./Routes/AdminRoutes");
const ledger = require("./Routes/LedgerRoutes");
//Common api starting

app.use("/smartdairy/api", admin);
app.use("/smartdairy/api", user);
app.use("/smartdairy/api", dairy);
app.use("/smartdairy/api", milk);
app.use("/smartdairy/api", ratechart);
app.use("/smartdairy/api", cust);
app.use("/smartdairy/api", emp);
app.use("/smartdairy/api", bank);
app.use("/smartdairy/api", purchase);
app.use("/smartdairy/api", payment);
app.use("/smartdairy/api", notify);
app.use("/smartdairy/api", sales);
app.use("/smartdairy/api", products);
app.use("/smartdairy/api", stocks);
app.use("/smartdairy/api", stockitem);
app.use("/smartdairy/api", deliverstock);
app.use("/smartdairy/api", ledger);
app.use("/smartdairy/api", deduction);

module.exports = app;
