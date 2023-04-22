import React from "react";

import AmountSection from "./AmountSection";
import ChartSection from "./ChartSection";
import FeeSection from "./FeeSection";

const AdminDashboard = () => {
  return (
    <div className="container-fluid px-4 py-4">
      <AmountSection></AmountSection>
      <ChartSection></ChartSection>
      <FeeSection></FeeSection>
    </div>
  );
};

export default AdminDashboard;
