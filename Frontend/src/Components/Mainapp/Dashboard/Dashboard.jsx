import React, { PureComponent, useEffect, Suspense, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell,
} from "recharts";
import { BsDatabaseAdd, BsPersonFill } from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import { BsCalendar3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllMilkCollReport } from "../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { listCustomer } from "../../../App/Features/Customers/customerSlice";
import Spinner from "../../Home/Spinner/Spinner";
import "../../../Styles/Mainapp/Dashbaord/Dashboard.css";
import { getCenterMilkData } from "../../../App/Features/Mainapp/Dashboard/dashboardSlice";
import { centersLists } from "../../../App/Features/Dairy/Center/centerSlice";
import { getCenterSetting } from "../../../App/Features/Mainapp/Settings/dairySettingSlice";

const Dashboard = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const center_id = useSelector((state) => state.dairy.dairyData.center_id);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const mastermilk = useSelector((state) => state.milkCollection.allMilkColl);
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails // center list
  );
  const centerLiterAmt = useSelector(
    (state) => state.admindashboard.centerMilk // center wise liter and amount
  );
  const status = useSelector((state) => state.milkCollection.allmilkstatus);
  const customerslist = useSelector((state) => state.customer.customerlist); //save customer list
  const fDate = useSelector((state) => state.date.formDate); // to fetch default date data
  const tDate = useSelector((state) => state.date.toDate); // to fetch default date data
  const [selectedDate, setSelectedDate] = useState(null);
  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
    dispatch(listCustomer());
  }, []);

  const customerCount = customerslist.length;
  const totalLitres = mastermilk.reduce((acc, item) => acc + item.Litres, 0);
  const totalAmt = mastermilk.reduce((acc, item) => acc + item.Amt, 0);
  const aggregatedData = mastermilk.reduce((acc, curr) => {
    const date = new Date(curr.ReceiptDate).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { totalLitres: 0, totalAmt: 0 };
    }
    acc[date].totalLitres += curr.Litres;
    acc[date].totalAmt += curr.Amt;
    return acc;
  }, {});

  // ---------------------------------------------------------------------------------------------->
  //  Data to show in bar chart ----------------------------------------------------------------->
  const chartData = Object.keys(aggregatedData).map((date) => ({
    date,
    totalLitres: aggregatedData[date].totalLitres.toFixed(1),
    totalAmt: aggregatedData[date].totalAmt.toFixed(1),
  }));

  const saveCustomerList = () => {
    localStorage.setItem("customerlist", JSON.stringify(customerslist));
  };

  // Store customerlist in localStorage whenever it updates
  useEffect(() => {
    saveCustomerList();
  }, [customerslist]);

  // Handle the date selection ------------------------------------------------------------------>

  useEffect(() => {
    if (selectedDate) {
      // If a date is selected from manualMaster, use it
      dispatch(
        getAllMilkCollReport({
          fromDate: selectedDate.start,
          toDate: selectedDate.end,
        })
      );
      if (center_id === 0) {
        dispatch(
          getCenterMilkData({
            fromDate: selectedDate.start,
            toDate: selectedDate.end,
          })
        );
      }
    } else if (fDate && tDate) {
      // If no date is selected, use fDate and tDate from Redux store
      dispatch(
        getAllMilkCollReport({
          fromDate: fDate,
          toDate: tDate,
        })
      );
      if (center_id === 0) {
        dispatch(
          getCenterMilkData({
            fromDate: fDate,
            toDate: tDate,
          })
        );
      }
    }
  }, [dispatch, selectedDate, fDate, tDate]);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedDate(selectedDates);
      // Store selected master in localStorage
      localStorage.setItem("selectedMaster", JSON.stringify(selectedDates));

      // The dispatch is now handled by useEffect
    } else {
      // If the user selects the default option, reset selectedDate to null
      setSelectedDate(null);
    }
  };

  // to show centerwise data ------------------------------------------------------------------->

  useEffect(() => {
    dispatch(centersLists());
    dispatch(getCenterSetting());
  }, [dispatch]);

  // Merged center data
  const centersmergedData = centerLiterAmt.map((literEntry) => {
    const center = centerList.find(
      (c) => c.center_id.toString() === literEntry.center_id.toString()
    );
    return {
      ...literEntry,
      center_name: center ? center.center_name : "Unknown",
    };
  });
  console.log("merged", centersmergedData);
  // ------------------------------------------------------------------------------------------->
  // simple line chart ------------------------------------------------------------------------->
  // ------------------------------------------------------------------------------------------->
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  // ------------------------------------------------------------------------------------------->
  // Pie chart Data to show center wise Milk Collection ---------------------------------------->
  // ------------------------------------------------------------------------------------------->

  const piechartdata = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <div className="main-dashboard-container w100 h1 d-flex-col bg6">
      <div className="dashboard-title w100 d-flex p10 ">
        <h3 className="subtitle">Dashbord</h3>
      </div>
      <div className="dashboard-scrll-container w100 h1 mh100 hidescrollbar ">
        {/* <div className="Milk-sale-details-container w100 h1 mh100 hidescrollbar sb p10">
          <span className="heading">Analytics : </span>
          <div className="liter-sales-details-container w100 h70 d-flex-col my10 br6 bg-fff sb p10">
            <span className="w100 label-text px10">Liters & Amount </span>
            <div className="liter-sales-details-inner-container w100 h90 d-flex sb p10">
              <div className="liter-sales-card w80 h1 d-flex-col sb p10 ">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={600}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalLitres"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="totalAmt" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="liter-sell-details w20 h1 d-flex-col a-center sb p10 bg5">
                <div className="details-card w80 h30 d-flex-col t-center">
                  <span className="heading">{totalAmt}</span>
                  <span className="info-text">Total Amount</span>
                </div>
                <div className="details-card w80 h30 d-flex-col t-center">
                  <span className="heading">{totalLitres}</span>
                  <span className="info-text">Total Liters</span>
                </div>
                <div className="details-card w80 h30 d-flex-col t-center">
                  <button type="button" disabled className="btn">
                    Show Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="liter-sales-details-container w100 h70 d-flex-col my10 br6 bg-fff sb p10">
            <span className="w100 label-text px10">
              Center Milk Collection :
            </span>
            <div className="liter-sales-details-inner-container w100 h70 d-flex sb p10">
              <div className="liter-sales-card w80 h1 d-flex-col sb p10 ">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={500} height={500}>
                    <Pie
                      data={piechartdata}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="liter-sell-details w20 h1 d-flex-col a-center sb p10 bg5">
                <div className="details-card w80 h30 d-flex-col center t-center">
                  <div className="w25 h40 colour-box br"></div>
                  <span className="info-text">center name</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="Milk-sale-details-container w100 h1 hidescrollbar">
          <form className="selection-container w100 h10 d-flex a-center j-start">
            <div className="select-data-text w50 h1 d-flex a-center p10">
              <span className="w30 info-text">Selected Data Period :</span>
              <span className="w50 label-text">
                {selectedDate !== null ? (
                  <h2 className="label-text px10">
                    <span className="info-text">
                      {new Date(selectedDate.start).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short", // Abbreviated month format
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span> To : </span>
                    <span className="info-text">
                      {new Date(selectedDate.end).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short", // Abbreviated month format
                        year: "numeric",
                      })}
                    </span>
                  </h2>
                ) : fDate && tDate ? (
                  <h2 className="label-text px10">
                    <span className="info-text">
                      {new Date(fDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span> To : </span>
                    <span className="info-text">
                      {new Date(tDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </h2>
                ) : (
                  <span></span>
                )}
              </span>
            </div>
            <div className="custmize-report-div w30 h1 px10 d-flex a-center sb">
              <span className="cl-icon w10 h1 d-flex center">
                <BsCalendar3 />
              </span>
              <select
                className="custom-select label-text w90 h1 p10"
                onChange={handleSelectChange}
              >
                <option className="label-text w100 d-flex">
                  --Select Master--
                </option>
                {manualMaster.map((dates, index) => (
                  <option
                    className="label-text w100 d-flex sa"
                    key={index}
                    value={index}
                  >
                    {new Date(dates.start).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short", // Abbreviated month format
                      year: "numeric",
                    })}
                    To :
                    {new Date(dates.end).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short", // Abbreviated month format
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="dashboard-cards w100 h20 d-flex j-start sa">
            <div className="card sb">
              <BsDatabaseAdd className="card-icon" />
              <div className="card-inner">
                <h3 className="text">Milk Collection</h3>
                <h3 className="heading">
                  {totalLitres.toFixed(1)}
                  <span>ltr</span>
                </h3>
              </div>
            </div>
            <div className="card sb">
              <BsPersonFill className="card-icon" />
              <div className="card-inner">
                <h3 className="text">Customers</h3>
                <h3 className="heading">{customerCount}</h3>
              </div>
            </div>
            <div className="card sb">
              <TfiStatsUp className="card-icon" />
              <div className="card-inner">
                <h3 className="text">Sales</h3>
                <h3 className="heading">
                  {totalAmt.toFixed(1) || 0} <span>Rs</span>
                </h3>
              </div>
            </div>
            {/* <div className="card">
            <BsCurrencyRupee className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Revenue</h3>
              <h3 className="heading">
                100 <span>Rs</span>
              </h3>
            </div>
          </div> */}
          </div>
          <div className="dashboard-data-charts w100 h50 d-flex a-center sa ">
            <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
              <div className="chart-title w100">
                <span className="label-text">Liters</span>
              </div>
              <Suspense
                fallback={
                  <div className="w100 h80 d-flex center">
                    <Spinner />
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={40}
                    data={chartData}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                    <YAxis
                      tick={{ fontSize: 8 }}
                      domain={[0, "dataMax + 10"]}
                    />
                    <Tooltip />
                    <Bar dataKey="totalLitres" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
            <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
              <div className="chart-title w100">
                <span className="label-text">Amount</span>
              </div>
              <Suspense
                fallback={
                  <div className="w100 h80 d-flex center">
                    <Spinner />
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={40}
                    data={chartData}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 5" />
                    <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                    <YAxis
                      tick={{ fontSize: 8 }}
                      domain={[0, "dataMax + 10"]}
                    />
                    <Tooltip />
                    <Bar dataKey="totalAmt" fill="#ffcc99" />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
          </div>
        </div>{" "}
        {center_id === 0 ? (
          <>
            <div className="Milk-sale-details-container w100 h1 p10 bg5">
              <h3 className="heading">Center Information : </h3>
              <div className="center-sales-details-container w100 h1 d-flex f-wrap sb p10">
                {centersmergedData.length > 0 ? (
                  centersmergedData.map((center, index) => (
                    <>
                      <div
                        key={index}
                        className="center-sales-card w45 h30 d-flex-col sb bg p10"
                      >
                        <div className="card-title w100 h25 d-flex sb">
                          <span className="w30 label-text">Center No : </span>
                          <span className="w70 label-text t-start">
                            {center.center_id}
                          </span>
                        </div>
                        <div className="card-title w100 h25 d-flex sb">
                          <span className="w30 label-text">Center Name : </span>
                          <span className="w70 label-text t-start">
                            {center.center_name}
                          </span>
                        </div>
                        <div className="card-other-outer-details w100 h50 d-flex sa">
                          <div className="card-other-details w30 h1 d-flex-col a-center sa bg5">
                            <span className="label-text">Customers</span>
                            <span className="label-text">0</span>
                          </div>
                          <div className="card-other-details w30 h1 d-flex-col a-center sa bg5">
                            <span className="label-text">Liters</span>
                            <span className="label-text">
                              {center.total_litres} ltr.
                            </span>
                          </div>
                          <div className="card-other-details w30 h1 d-flex-col a-center sa bg5">
                            <span className="label-text">Sales</span>
                            <span className="label-text">
                              {center.total_amount} rs.
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="box d-flex center">
                    <span className="label-text">Data Not Found!</span>
                  </div>
                )}
              </div>
            </div>
            <div className="liter-sales-details-inner-container w100 h70 d-flex-col sb p10">
              <span className="heading">Analytics : </span>
              <div className="pie-chart-container w100 h1 d-flex a-center sb p10">
                <div className="liter-sales-card w25 h90 d-flex-col sb bg-fff br6 p10 ">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={500} height={500}>
                      <Pie
                        data={centerLiterAmt}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total_litres"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="label-text p10 bg6 br6">Liter chart :</span>
                </div>
                <div className="liter-sales-card w25 h90 d-flex-col bg-fff br6 sb p10 ">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={500} height={500}>
                      <Pie
                        data={centerLiterAmt}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total_amount"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="label-text p10 bg6 br6">Amount chart :</span>
                </div>
                <div className="liter-sell-details w20 h1 d-flex-col a-center sb bg6 br6 p10 bg5">
                  {centersmergedData.map((center, index) => (
                    <div className="details-card w100 h50 d-flex-col center t-center">
                      <div
                        className="w25 h30 colour-box br"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="info-text">
                        Center No. : {center.center_id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
