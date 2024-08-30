import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { fetchMilkReports } from "../../../App/Features/Customers/Milk/milkSlice";
import "../../../Styles/Customer/CustNavViews/Custdashboard.css";

const Custdashboard = () => {
  const dispatch = useDispatch();

  const { summary } = useSelector((state) => state.milk.milkReport);
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
  return (
    <div className="cust-dashboard-information w100 h1 d-flex-col">
      <div className="menu-title-div w70 mx-15 h10 d-flex p10">
        <h2 className="heading">
          Dashboard <span className="text">(Current Payment slot info)</span>
        </h2>
      </div>
      <div className="cust-dashboard-data w70 mx-15 h20 d-flex sa p10">
        <div className="data-conatiner w20 bg">
          <span className="sub-heading">Total Liters</span>
          <span className="info-text">{summary.totalLiters}</span>
        </div>
        <div className="data-conatiner w15 bg">
          <span className="sub-heading">Avg FAT</span>
          <span className="info-text">{summary.avgFat}</span>
        </div>
        <div className="data-conatiner w15 bg">
          <span className="sub-heading">Avg SNF</span>
          <span className="info-text">{summary.avgSNF}</span>
        </div>
        <div className="data-conatiner w15 bg">
          <span className="sub-heading">Avg Rate</span>
          <span className="info-text">{summary.avgRate}</span>
        </div>
        <div className="data-conatiner w25 bg">
          <span className="sub-heading">Total Amount</span>
          <span className="info-text">{summary.totalAmount}</span>
        </div>
      </div>
      <div className="cust-dashboard-charts w70 h70 mx-15 d-flex">
        <div className="milk-collection-chart w50 h1 d-flex-col p10 bg">
          <div className="chart-title w100 h10">
            <span className="text">Milk Collection</span>
          </div>
          <div className="chart-div w100 h90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={150} height={40} data={data}>
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custdashboard;
