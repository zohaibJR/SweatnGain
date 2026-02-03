import React from "react";
import SummaryCards from "../Components/SummaryCards/SummaryCards";
import WeightProgress from "../Components/WeightProgress/WeightProgress";
import QuickView from "../Components/QuickView/QuickView";
import Quote from "../Components/Quote/Quote";
import './Style/Dashboard.css'

function DashBoard() {
  return (
    <div className="MainDashboard">
      <SummaryCards />
      <WeightProgress />
      <QuickView />
      <Quote />
    </div>
  );
}

export default DashBoard;
