import React from "react";
import { useNavigate } from "react-router-dom";
import "./Leave.css";

const Leave = () => {
  // Initialize navigation for redirection
  const navigate = useNavigate();

  return (
    <div className="leave-dashboard">
      <h2>Leave Management</h2>
      <div className="leave-links">
        {/* Button to navigate to Apply Leave page */}
        <button onClick={() => navigate("/applyLeave")}>Apply Leave</button>
        
        {/* Button to view Leave History */}
        <button onClick={() => navigate("/viewLeave")}>Leave History</button>

        {/* Button to view Pending Leave Requests */}
        <button onClick={() => navigate("/pendingLeaveRequests")}>Pending Leave Requests</button> 
        
        {/* Button to view Leave Balance */}
        <button onClick={() => navigate("/leaveBalance")}>Leave Balance</button>
      </div>
    </div>
  );
};

export default Leave;
