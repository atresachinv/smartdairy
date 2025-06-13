const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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
const milkSales = require("./Routes/MilkSalesRoutes");
const cust = require("./Routes/CustomerRoutes");
const emp = require("./Routes/EmpRoutes");
const bank = require("./Routes/BankRoutes");
const doctor = require("./Routes/DoctorRoutes");
const animal = require("./Routes/AnimalRoutes");
const sangha = require("./Routes/SanghaRoutes");
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
const account = require("./Routes/AccountRoutes");
const dairySetting = require("./Routes/DairySetting");
const smsSetting = require("./Routes/SmsSettingRoutes");
//Common api starting

app.use("/smartdairy/api", admin);
app.use("/smartdairy/api", user);
app.use("/smartdairy/api", dairy);
app.use("/smartdairy/api", milk);
app.use("/smartdairy/api", milkSales);
app.use("/smartdairy/api", ratechart);
app.use("/smartdairy/api", cust);
app.use("/smartdairy/api", emp);
app.use("/smartdairy/api", bank);
app.use("/smartdairy/api", doctor);
app.use("/smartdairy/api", animal);
app.use("/smartdairy/api", sangha);
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
app.use("/smartdairy/api", account);
app.use("/smartdairy/api", dairySetting);
app.use("/smartdairy/api", smsSetting);
module.exports = app;
