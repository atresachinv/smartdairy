import React, { PureComponent } from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { BsDatabaseAdd, BsPersonFill, BsCurrencyRupee } from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import "../../../Styles/Mainapp/Dashbaord/Dashboard.css";

const Dashboard = () => {
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
    <div className="main-dashboard-container w100 h1 d-flex-col">
      <div className="dashboard-title w100 d-flex p10">
        <h3 className="subtitle">Dashbord</h3>
      </div>
      <div className="dashboard-scrll-container w100">
        <form className="selection-container w100 h20 d-flex">
          <div className="select-data-text w20 h50 d-flex-col p10">
            <span className="text">Select Data Period</span>
          </div>
          <form className="priod-container w40 h50 d-flex a-center sb p10">
            <select className="months-selector w50" name="" id="">
              <option>-- Select Month --</option>
              <option value="1">January</option>
              <option value="2">Feburary</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">Augast</option>
              <option value="9">Sepetaber</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <button className="show-btn w20">SHOW</button>
          </form>
        </form>
        <div className="dashboard-cards w100 h20 d-flex sa">
          <div className="card">
            <BsDatabaseAdd className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Milk Collection</h3>
              <h3 className="heading">
                1000 <span>ltr</span>
              </h3>
            </div>
          </div>
          <div className="card">
            <BsPersonFill className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Customers</h3>
              <h3 className="heading">100</h3>
            </div>
          </div>
          <div className="card">
            <TfiStatsUp className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Sales</h3>
              <h3 className="heading">
                100 <span>Rs</span>
              </h3>
            </div>
          </div>
          <div className="card">
            <BsCurrencyRupee className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Revenue</h3>
              <h3 className="heading">
                100 <span>Rs</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="dashboard-data-charts w100 h50 d-flex a-center sa">
          <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
            <div className="chart-title w100">
              <span className="text">Milk Collection</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={150} height={40} data={data}>
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
            <div className="chart-title w100">
              <span className="text">Milk Collection</span>
            </div>
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

export default Dashboard;
