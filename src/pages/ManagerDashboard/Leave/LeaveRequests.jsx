import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";

const LeaveRequests = () => {
  // State to store leave requests
  const [requests, setRequests] = useState([]);

  // State to handle errors
  const [error, setError] = useState("");

  // Fetch leave requests when the component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // API request to fetch leave requests
        const response = await api.get("/leave-requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error.response?.data || error.message);
        setError("Failed to load leave requests. Please try again.");
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="leave-requests-container">
      <h2>Leave Requests</h2>

      {/* Display error message if an issue occurs */}
      {error && <p className="text-danger">{error}</p>}

      {/* Render leave request details if successfully fetched */}
      {requests.length === 0 && !error ? (
        <p>No leave requests found.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              {request.employeeName} requested leave from {request.startDate} to {request.endDate} - <strong>{request.status}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaveRequests;
