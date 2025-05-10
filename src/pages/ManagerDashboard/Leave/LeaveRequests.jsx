import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
// import "./LeaveRequests.css";

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/leave-requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="leave-requests-container">
      <h2>Leave Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            {request.employeeName} requested leave from {request.startDate} to {request.endDate} - <strong>{request.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequests;
