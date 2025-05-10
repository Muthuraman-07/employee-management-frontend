// import React, { useEffect, useState } from "react";
// import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import "./Leave.css";

const Leave = () => {
  const navigate = useNavigate();

  

  return (
    <div className="leave-dashboard">
      <h2>Leave Management</h2>
      <div className="leave-links">
        <button onClick={() => navigate("/applyLeave")}>Apply Leave</button>
        <button onClick={() => navigate("/leave-history")}>Leave History</button>
        <button onClick={() => navigate("/leave-requests")}>Leave Requests</button>
        <button onClick={() => navigate("/leave-balance")}>Leave Balance</button> {/* New button added */}
      </div>
    </div>
  );
};

export default Leave;
