import React, { useEffect, Suspense, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
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
import {
  getCenterCustCount,
  getCenterMilkData,
} from "../../../App/Features/Mainapp/Dashboard/dashboardSlice";
import { centersLists } from "../../../App/Features/Dairy/Center/centerSlice";
import "../../../Styles/Mainapp/Dashbaord/Dashboard.css";
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
  const customerCounts = useSelector(
    (state) => state.admindashboard.custCount // center wise liter and amount
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
        dispatch(centersLists());
        dispatch(getCenterCustCount());
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
    dispatch(getCenterSetting());
  }, [dispatch]);

  // Merged center data
  const centersmergedData = centerLiterAmt.map((literEntry) => {
    const center = centerList.find(
      (c) => c.center_id.toString() === literEntry.center_id.toString()
    );
    const customerCount = customerCounts.find(
      (cust) => cust.centerid.toString() === literEntry.center_id.toString()
    );
    return {
      ...literEntry,
      center_name: center ? center.center_name : "Unknown",
      total_customers: customerCount ? customerCount.total_customers : 0,
    };
  });

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
    <div className="main-dashboard-container w100 h1 d-flex-col">
      <div className="dashboard-title w100 d-flex p10 ">
        <h3 className="subtitle">{t("nv-dash")}</h3>
      </div>
      <div className="dashboard-scrll-container w100 h1 mh100 hidescrollbar ">
        <div className="Milk-sale-details-container w100 h1 hidescrollbar">
          <form className="selection-container w100 h10 d-flex a-center j-start">
            <div className="select-data-text w50 h1 d-flex a-center p10">
              <span className="w30 info-text">{t("c-select-period")} :</span>
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
                  --{t("c-select-master")}--
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
                    {t("c-to")} :
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
          <div className="dashboard-cards w100 h15 d-flex j-start sa">
            <div className="card h1 sb">
              <BsDatabaseAdd className="card-icon" />
              <div className="card-inner">
                <h3 className="text">{t("nv-milk-coll")}</h3>
                <h3 className="heading">
                  {totalLitres.toFixed(1)}
                  <span>{t("c-ltr")}</span>
                </h3>
              </div>
            </div>
            <div className="card h1 sb">
              <BsPersonFill className="card-icon" />
              <div className="card-inner">
                <h3 className="text">{t("c-customer")}</h3>
                <h3 className="heading">{customerCount}</h3>
              </div>
            </div>
            <div className="card h1 sb">
              <TfiStatsUp className="card-icon" />
              <div className="card-inner">
                <h3 className="text">{t("c-purch-amt")}</h3>
                <h3 className="heading">
                  {totalAmt.toFixed(1) || 0} <span>{t("c-rs")}</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="dashboard-data-charts w100 h50 d-flex a-center sa ">
            <div className="milk-collection-chart w40 h1 d-flex-col p10">
              <div className="chart-title w100">
                <span className="label-text">{t("c-liter-chart")}</span>
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
                    <Bar dataKey="totalLitres" fill="#095bc7" />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
            <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
              <div className="chart-title w100">
                <span className="label-text">{t("c-amt-chart")}</span>
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
                    <Bar dataKey="totalAmt" fill="#095bc7" />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
          </div>
        </div>
        {center_id === 0 ? (
          <>
            <div className="center-sale-details-outer-container w100 d-flex-col p10 bg5">
              <h3 className="heading">{t("c-center-info")} : </h3>
              <div className="center-sales-details-container w100 h1 d-flex f-wrap sb p10">
                {centersmergedData.length > 0 ? (
                  centersmergedData.map((center) => (
                    <>
                      <div
                        key={center.center_id}
                        className="center-sales-card w45 h30 d-flex-col sb bg-light-green br9 p10"
                      >
                        <div className="card-title w100 h25 d-flex sb">
                          <span className="w30 text">{t("c-centerno")} : </span>
                          <span className="w70 info-text t-start">
                            {center.center_id}
                          </span>
                        </div>
                        <div className="card-title w100 h25 d-flex sb">
                          {/* <span className="w30 info-text">Center Name : </span> */}
                          <span className="w100 label-text t-start">
                            {center.center_name}
                          </span>
                        </div>
                        <div className="card-other-outer-details w100 h50 d-flex sa">
                          <div className="card-other-details w30 h1 d-flex-col a-center sa br6 bg5">
                            <span className="text">{t("c-customer")}</span>
                            <span className="label-text">
                              {center.total_customers}
                            </span>
                          </div>
                          <div className="card-other-details w30 h1 d-flex-col a-center sa br6 bg5">
                            <span className="text">{t("c-liters")}</span>
                            <span className="label-text">
                              {center.total_litres} {t("c-ltr")}
                            </span>
                          </div>
                          <div className="card-other-details w30 h1 d-flex-col a-center sa br6 bg5">
                            <span className="text">{t("c-purch-amt")}</span>
                            <span className="label-text">
                              {center.total_amount} {t("c-rs")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="box d-flex center">
                    <span className="label-text">{t("c-no-data-avai")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="liter-sales-details-inner-container w100 h50 d-flex-col sb p10">
              <span className="heading">{t("c-anaylatics")} : </span>
              <div className="pie-chart-container w100 h1 d-flex a-center sb p10">
                <div className="liter-sales-card w25 h90 d-flex-col sb bg-light-skyblue br6 p10 ">
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
                        {centerLiterAmt.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="label-text w100 h15 d-flex a-center px10 bg6 br6">
                    {t("c-liter-chart")} :
                  </span>
                </div>
                <div className="liter-sales-card w25 h90 d-flex-col bg-light-skyblue br6 sb p10 ">
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
                        {centerLiterAmt.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="label-text w100 h15 d-flex a-center px10 bg6 br6">
                    {t("c-amt-chart")} :
                  </span>
                </div>
                <div className="liter-sell-details w20 h1 d-flex-col a-center bg6 br6 p10 bg5">
                  {centersmergedData.map((center, index) => (
                    <div className="details-card w50 h25 d-flex-col center t-center">
                      <div
                        className="w30 h25 colour-box br6"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="text">
                        {t("c-centerno")} :{" "}
                        <span className="label-text">{center.center_id}</span>
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
