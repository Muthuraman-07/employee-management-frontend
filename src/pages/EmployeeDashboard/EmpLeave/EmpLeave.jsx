import React from "react";
import { useNavigate } from "react-router-dom"; 

const EmpLeave = () => {
  const navigate = useNavigate();

  return (
    <div className="leave-dashboard">
      <h2>Leave Management</h2>
      <div className="leave-links">
        {/* Button to navigate to Leave Application Page */}
        <button onClick={() => navigate("/applyLeave")}>Apply Leave</button>
        
        {/* Button to navigate to Leave History */}
        <button onClick={() => navigate("/viewLeave")}>Leave History</button>
        
        
        {/* Button to navigate to Leave Balance Overview */}
        <button onClick={() => navigate("/leaveBalance")}>Leave Balance</button>
      </div>
    </div>
  );
};

export default EmpLeave;
