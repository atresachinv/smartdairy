import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../../App/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Inventory = () => {
  const [regularSalesResponse, setRegularSalesResponse] = useState([]);
  const [returnSalesResponse, setReturnSalesResponse] = useState([]);
  const [regularPurchaseResponse, setRegularPurchaseResponse] = useState([]);
  const [returnPurchaseResponse, setReturnPurchaseResponse] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [purchaseData, setPurchaseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const financialYearStart = new Date(currentYear, 3, 1); // April 1st of current year
    return financialYearStart;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const centerList = useSelector((state) => state.center.centersList || []);
  const [filter, setFilter] = useState("");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .reverse()
      .join("-");
  };

  const getFinancialYearStart = (date) => {
    const year = date.getFullYear();
    return new Date(year, 3, 1); // April 1st
  };

  const getFinancialYearEnd = (date) => {
    const year = date.getFullYear();
    return new Date(year + 1, 2, 31); // March 31st of next year
  };

  const handleCardClick = (type) => {
    setModalType(type);
    if (type === "returns") {
      setModalData({
        salesReturnQty: salesData.returnQty || 0,
        salesReturnAmount: salesData.returnAmount || 0,
        purchaseReturnQty: purchaseData.returnQty || 0,
        purchaseReturnAmount: purchaseData.returnAmount || 0,
        salesReturns: salesData.returnItems || [],
        purchaseReturns: purchaseData.returnItems || [],
      });
    } else {
      setModalData(type === "sales" ? salesData : purchaseData);
    }
    setShowModal(true);
  };

  const Modal = ({ onClose, data, type }) => {
    if (!data) return null;

    const getTableData = () => {
      if (type === "sales") {
        return data.items?.map((item) => ({
          date: item.date,
          billNo: item.billNo,
          itemName: item.itemName,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
          customer: item.customer,
          type: "Regular Sale",
        }));
      } else if (type === "purchases") {
        return data.items?.map((item) => ({
          date: item.date,
          billNo: item.billNo,
          itemName: item.itemName,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
          dealer: item.dealer,
          type: "Regular Purchase",
        }));
      } else if (type === "returns") {
        return [
          ...(data.salesReturns || []).map((item) => ({
            ...item,
            type: "Sales Return",
          })),
          ...(data.purchaseReturns || []).map((item) => ({
            ...item,
            type: "Purchase Return",
          })),
        ];
      }
      return [];
    };

    const tableData = getTableData();

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflow: "auto",
            width: "100%",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h2>
              {type === "sales"
                ? "Sales Report"
                : type === "purchases"
                ? "Purchase Report"
                : "Return Report"}
            </h2>
            <button onClick={onClose} style={{ padding: "5px 10px" }}>
              Close
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>Summary</h3>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {type === "returns" ? (
                <>
                  <div>
                    <strong>Total Sales Returns:</strong>{" "}
                    {data.salesReturnQty || 0}
                    <br />
                    <strong>Amount:</strong> ₹{data.salesReturnAmount || 0}
                  </div>
                  <div>
                    <strong>Total Purchase Returns:</strong>{" "}
                    {data.purchaseReturnQty || 0}
                    <br />
                    <strong>Amount:</strong> ₹{data.purchaseReturnAmount || 0}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>Total Quantity:</strong> {data.totalQty || 0}
                  </div>
                  <div>
                    <strong>Total Amount:</strong> ₹{data.totalAmount || 0}
                  </div>
                  {type === "sales" && (
                    <div>
                      <strong>Total Returns:</strong> {data.returnQty || 0}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "600px",
              }}
            >
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>
                    {type === "returns"
                      ? "Customer/Dealer"
                      : type === "sales"
                      ? "Customer"
                      : "Dealer"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.type}</td>
                      <td>{formatDate(row.date)}</td>
                      <td>{row.billNo}</td>
                      <td>{row.itemName}</td>
                      <td>{row.qty}</td>
                      <td>{row.rate}</td>
                      <td>{row.amount}</td>
                      <td>
                        {type === "returns"
                          ? row.type === "Sales Return"
                            ? row.customer
                            : row.dealer
                          : type === "sales"
                          ? row.customer
                          : row.dealer}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
      totalQty: PropTypes.number,
      totalAmount: PropTypes.number,
      returnQty: PropTypes.number,
      salesReturnQty: PropTypes.number,
      salesReturnAmount: PropTypes.number,
      purchaseReturnQty: PropTypes.number,
      purchaseReturnAmount: PropTypes.number,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          billNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          itemName: PropTypes.string,
          qty: PropTypes.number,
          rate: PropTypes.number,
          amount: PropTypes.number,
          customer: PropTypes.string,
          dealer: PropTypes.string,
        })
      ),
      salesReturns: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          billNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          itemName: PropTypes.string,
          qty: PropTypes.number,
          rate: PropTypes.number,
          amount: PropTypes.number,
          customer: PropTypes.string,
        })
      ),
      purchaseReturns: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          billNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          itemName: PropTypes.string,
          qty: PropTypes.number,
          rate: PropTypes.number,
          amount: PropTypes.number,
          dealer: PropTypes.string,
        })
      ),
    }),
    type: PropTypes.oneOf(["sales", "purchases", "returns"]).isRequired,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const getItem = {
        date1: formatDateForAPI(startDate),
        date2: formatDateForAPI(endDate),
      };

      try {
        const queryParams = new URLSearchParams(getItem).toString();

        const [
          regularSalesResponse,
          returnSalesResponse,
          regularPurchaseResponse,
          returnPurchaseResponse,
        ] = await Promise.all([
          axiosInstance.get(`/sale/all?cn=0&${queryParams}`),
          axiosInstance.get(`/sale/all?cn=1&${queryParams}`),
          axiosInstance.get(`/purchase/all?cn=0&${queryParams}`),
          axiosInstance.get(`/purchase/all?cn=1&${queryParams}`),
        ]);

        setRegularSalesResponse(regularSalesResponse.data.salesData || []);
        setReturnSalesResponse(returnSalesResponse.data.salesData || []);
        setRegularPurchaseResponse(
          regularPurchaseResponse.data.purchaseData || []
        );
        setReturnPurchaseResponse(
          returnPurchaseResponse.data.purchaseData || []
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const processData = () => {
      let regularSalesArray = regularSalesResponse;
      let returnSalesArray = returnSalesResponse;
      let regularPurchaseArray = regularPurchaseResponse;
      let returnPurchaseArray = returnPurchaseResponse;

      // Process sales data
      // let regularSalesArray = regularSalesResponse.data.salesData || [];
      // let returnSalesArray = returnSalesResponse.data.salesData || [];

      // Filter data based on selected center
      const filterCenterId =
        centerId > 0
          ? parseInt(centerId)
          : filter !== ""
          ? parseInt(filter)
          : null;

      if (filterCenterId !== null) {
        regularSalesArray = regularSalesArray.filter(
          (sale) => sale.center_id === filterCenterId
        );
        returnSalesArray = returnSalesArray.filter(
          (sale) => sale.center_id === filterCenterId
        );
      }

      const totalSalesQty = regularSalesArray.reduce(
        (sum, sale) => sum + (sale.Qty || 0),
        0
      );
      const totalReturnQty = returnSalesArray.reduce(
        (sum, sale) => sum + (sale.Qty || 0),
        0
      );
      const totalSalesAmount = regularSalesArray.reduce(
        (sum, sale) => sum + (sale.Amount || 0),
        0
      );
      const totalReturnAmount = returnSalesArray.reduce(
        (sum, sale) => sum + (sale.Amount || 0),
        0
      );

      // Process purchase data
      // let regularPurchaseArray = regularPurchaseResponse.data.purchaseData || [];
      // let returnPurchaseArray = returnPurchaseResponse.data.purchaseData || [];

      // Filter purchase data based on selected center
      if (filterCenterId !== null) {
        regularPurchaseArray = regularPurchaseArray.filter(
          (purchase) => purchase.center_id === filterCenterId
        );
        returnPurchaseArray = returnPurchaseArray.filter(
          (purchase) => purchase.center_id === filterCenterId
        );
      }

      const totalPurchaseQty = regularPurchaseArray.reduce(
        (sum, purchase) => sum + (purchase.qty || 0),
        0
      );
      const totalReturnPurchaseQty = returnPurchaseArray.reduce(
        (sum, purchase) => sum + (purchase.qty || 0),
        0
      );
      const totalPurchaseAmount = regularPurchaseArray.reduce(
        (sum, purchase) => sum + (purchase.amount || 0),
        0
      );
      const totalReturnPurchaseAmount = returnPurchaseArray.reduce(
        (sum, purchase) => sum + (purchase.amount || 0),
        0
      );

      // Group sales by month for chart
      const monthlySales = {};
      const monthlyPurchases = {};

      [...regularSalesArray, ...returnSalesArray].forEach((sale) => {
        const date = new Date(sale.BillDate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlySales[month] = (monthlySales[month] || 0) + (sale.Qty || 0);
      });

      [...regularPurchaseArray, ...returnPurchaseArray].forEach((purchase) => {
        const date = new Date(purchase.purchasedate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyPurchases[month] =
          (monthlyPurchases[month] || 0) + (purchase.qty || 0);
      });

      setSalesData({
        totalQty: totalSalesQty,
        returnQty: totalReturnQty,
        totalAmount: totalSalesAmount,
        returnAmount: totalReturnAmount,
        monthlyData: monthlySales,
        items: regularSalesArray.map((sale) => ({
          id: sale.saleid,
          billNo: sale.ReceiptNo,
          date: sale.BillDate,
          itemName: sale.ItemName,
          qty: sale.Qty,
          rate: sale.Rate,
          amount: sale.Amount,
          customer: sale.cust_name,
        })),
        returnItems: returnSalesArray.map((sale) => ({
          id: sale.saleid,
          billNo: sale.ReceiptNo,
          date: sale.BillDate,
          itemName: sale.ItemName,
          qty: sale.Qty,
          rate: sale.Rate,
          amount: sale.Amount,
          customer: sale.cust_name,
        })),
      });

      setPurchaseData({
        totalQty: totalPurchaseQty,
        returnQty: totalReturnPurchaseQty,
        totalAmount: totalPurchaseAmount,
        returnAmount: totalReturnPurchaseAmount,
        monthlyData: monthlyPurchases,
        items: regularPurchaseArray.map((purchase) => ({
          id: purchase.purchaseid,
          billNo: purchase.receiptno,
          date: purchase.purchasedate,
          itemName: purchase.itemname,
          qty: purchase.qty,
          rate: purchase.rate,
          amount: purchase.amount,
          dealer: purchase.dealerName,
        })),
        returnItems: returnPurchaseArray.map((purchase) => ({
          id: purchase.purchaseid,
          billNo: purchase.receiptno,
          date: purchase.purchasedate,
          itemName: purchase.itemname,
          qty: purchase.qty,
          rate: purchase.rate,
          amount: purchase.amount,
          dealer: purchase.dealerName,
        })),
      });
    };
    processData();
  }, [
    regularSalesResponse,
    returnSalesResponse,
    regularPurchaseResponse,
    returnPurchaseResponse,
    centerId,
    filter,
  ]);

  const salesChartData = {
    labels: Object.keys(salesData.monthlyData || {}),
    datasets: [
      {
        label: "Monthly Sales",
        data: Object.values(salesData.monthlyData || {}),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const purchaseChartData = {
    labels: Object.keys(purchaseData.monthlyData || {}),
    datasets: [
      {
        label: "Monthly Purchases",
        data: Object.values(purchaseData.monthlyData || {}),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const inventoryStatusData = {
    labels: ["Sales", "Purchases", "Returns"],
    datasets: [
      {
        data: [
          salesData.totalQty || 0,
          purchaseData.totalQty || 0,
          salesData.returnQty || 0,
        ],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(255, 99, 132)",
        ],
      },
    ],
  };

  const topSalesItemsData = {
    labels: salesData.items?.map((item) => item.itemName) || [],
    datasets: [
      {
        label: "Top Selling Items",
        data: salesData.items?.map((item) => item.qty) || [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const topPurchaseItemsData = {
    labels: purchaseData.items?.map((item) => item.itemName) || [],
    datasets: [
      {
        label: "Top Purchased Items",
        data: purchaseData.items?.map((item) => item.qty) || [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="w100 h1 d-flex-col">
      <div className="heading w100 d-flex j-center">इन्व्हेंटरी डॅशबोर्ड</div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ scrollbarWidth: "none", overflowY: "auto" }}>
          <div
            className="date-filter-container"
            style={{
              margin: "10px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ margin: "5px" }}>
              <label>Start Date: </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd-MM-yyyy"
                className="data w60"
                minDate={getFinancialYearStart(new Date())}
                maxDate={getFinancialYearEnd(new Date())}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
              />
            </div>
            <div style={{ margin: "5px" }}>
              <label>End Date: </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd-MM-yyyy"
                className="data w60"
                minDate={startDate}
                maxDate={getFinancialYearEnd(new Date())}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
              />
            </div>
            {centerId > 0 ? (
              <></>
            ) : (
              <div style={{ margin: "5px" }}>
                <span className="info-text">सेंटर निवडा :</span>
                <select
                  className="data w60 a-center  my5 mx5"
                  name="center"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {centerList &&
                    [...centerList]
                      .sort((a, b) => a.center_id - b.center_id)
                      .map((center, index) => (
                        <option key={index} value={center.center_id}>
                          {center.center_name}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>

          <div className="inventory-dashboard">
            <div className="inventory-dashboard-scroll m10">
              <div
                className="d-flex w100 sa"
                style={{
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div
                  className="Inventory-dashboard-card"
                  onClick={() => handleCardClick("sales")}
                  style={{
                    cursor: "pointer",
                    minWidth: "250px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(24, 173, 232, 0.93)",
                  }}
                >
                  <div className="Inventory-dashboard-card-title">
                    Total Sale Qty
                  </div>
                  <div className="Inventory-dashboard-card-value">
                    {loading ? "Loading..." : salesData.totalQty || 0}
                  </div>
                  <div className="Inventory-dashboard-card-subtitle">
                    Amount: ₹{salesData.totalAmount || 0}
                  </div>
                </div>
                <div
                  className="Inventory-dashboard-card"
                  onClick={() => handleCardClick("purchases")}
                  style={{
                    cursor: "pointer",
                    minWidth: "250px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(227, 188, 18, 0.97)",
                  }}
                >
                  <div className="Inventory-dashboard-card-title">
                    Total Purchase Qty
                  </div>
                  <div className="Inventory-dashboard-card-value">
                    {loading ? "Loading..." : purchaseData.totalQty || 0}
                  </div>
                  <div className="Inventory-dashboard-card-subtitle">
                    Amount: ₹{purchaseData.totalAmount || 0}
                  </div>
                </div>
                <div
                  className="Inventory-dashboard-card"
                  onClick={() => handleCardClick("returns")}
                  style={{
                    cursor: "pointer",
                    minWidth: "250px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(225, 68, 68, 0.77)",
                  }}
                >
                  <div className="Inventory-dashboard-card-title">
                    Total Return Qty
                  </div>
                  <div className="Inventory-dashboard-card-value">
                    {loading ? "Loading..." : salesData.returnQty || 0}
                  </div>
                </div>
              </div>

              <div
                className="charts-container d-flex w100 wrap j-around"
                style={{
                  marginTop: "30px",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="chart-card d-flex-col j-center"
                  style={{
                    minWidth: "300px",
                    maxWidth: "500px",
                  }}
                >
                  <h3>Sales Trend</h3>
                  <Line data={salesChartData} />
                </div>

                <div
                  className="chart-card d-flex-col j-center"
                  style={{
                    minWidth: "300px",
                    maxWidth: "500px",
                  }}
                >
                  <h3>Purchase Trend</h3>
                  <Line data={purchaseChartData} />
                </div>

                <div
                  className="chart-card d-flex-col j-center "
                  style={{
                    minWidth: "300px",
                    maxWidth: "500px",
                  }}
                >
                  <h3>Inventory Status</h3>
                  <Pie data={inventoryStatusData} />
                </div>
              </div>

              <div
                className="charts-container d-flex w100 wrap j-around"
                style={{
                  marginTop: "20px",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="chart-card"
                  style={{
                    minWidth: "300px",
                    maxWidth: "500px",
                    margin: "10px",
                  }}
                >
                  <h3>Top Selling Items</h3>
                  <Line data={topSalesItemsData} />
                </div>

                <div
                  className="chart-card"
                  style={{
                    minWidth: "300px",
                    maxWidth: "500px",
                    margin: "10px",
                  }}
                >
                  <h3>Top Purchased Items</h3>
                  <Line data={topPurchaseItemsData} />
                </div>
              </div>

              <div
                className="data-tables"
                style={{
                  marginTop: "20px",
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div
                  className="table-container"
                  style={{
                    marginBottom: "20px",
                    width: "100%",
                    overflow: "hidden",
                    minHeight: "200px",
                  }}
                >
                  <div className="w100 d-flex heading j-center">
                    Recent Sales
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "800px",
                        tableLayout: "fixed",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "15%", padding: "8px" }}>Date</th>
                          <th style={{ width: "10%", padding: "8px" }}>
                            Bill No
                          </th>
                          <th style={{ width: "20%", padding: "8px" }}>Item</th>
                          <th style={{ width: "10%", padding: "8px" }}>Qty</th>
                          <th style={{ width: "10%", padding: "8px" }}>Rate</th>
                          <th style={{ width: "10%", padding: "8px" }}>
                            Amount
                          </th>
                          <th style={{ width: "25%", padding: "8px" }}>
                            Customer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.items?.length > 0 ? (
                          salesData.items?.slice(0, 5).map((item) => (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: "1px solid #ddd",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            >
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {formatDate(item.date)}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.billNo}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.itemName}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.qty}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.rate}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.amount}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.customer}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  className="table-container"
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    minHeight: "200px",
                  }}
                >
                  <div className="w100 d-flex heading j-center">
                    Recent Purchases
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "800px",
                        tableLayout: "fixed",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "15%", padding: "8px" }}>Date</th>
                          <th style={{ width: "10%", padding: "8px" }}>
                            Bill No
                          </th>
                          <th style={{ width: "20%", padding: "8px" }}>Item</th>
                          <th style={{ width: "10%", padding: "8px" }}>Qty</th>
                          <th style={{ width: "10%", padding: "8px" }}>Rate</th>
                          <th style={{ width: "10%", padding: "8px" }}>
                            Amount
                          </th>
                          <th style={{ width: "25%", padding: "8px" }}>
                            Dealer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseData.items?.length > 0 ? (
                          purchaseData.items?.slice(0, 5).map((item) => (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: "1px solid #ddd",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            >
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {formatDate(item.date)}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.billNo}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.itemName}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.qty}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.rate}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.amount}
                              </td>
                              <td style={{ padding: "8px", textAlign: "left" }}>
                                {item.dealer}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              data={modalData}
              type={modalType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
