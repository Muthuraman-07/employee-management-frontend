import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingLeaveRequests = () => {
  // State variables to store leave requests and employee details
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null); 

  // Fetch username from localStorage
  const username = localStorage.getItem("username"); 

  // Fetch employee ID based on username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        setEmployeeId(response.data.employeeId);
      } catch (err) {
        console.error("Error fetching employee ID:", err.response?.data || err.message);
        setError("Failed to retrieve employee ID.");
      }
    };

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

  // Fetch pending leave requests once employee ID is retrieved
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await api.get(`leave/leave-history-by-status/PENDING/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error.response?.data || error.message);
        setError("Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchLeaveRequests();
    }
  }, [employeeId]);

  // Notify employee when logging in about leave request status
  useEffect(() => {
    const savedStatus = localStorage.getItem(`leaveRequest_${employeeId}`);
    if (savedStatus) {
      toast.info(`Your leave request has been ${savedStatus.toLowerCase()}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      localStorage.removeItem(`leaveRequest_${employeeId}`);
    }
  }, [employeeId]);

  // Handle approval or rejection of leave requests
  const handleAction = async (leaveId, status, employeeId) => {
    try {
      await api.patch(`leave/approve-leaveRequest/${leaveId}/${status}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      localStorage.setItem(`leaveRequest_${employeeId}`, status === "APPROVED" ? "APPROVED" : "REJECTED");

      toast.success(`Leave request ${status.toLowerCase()}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.leaveId === leaveId ? { ...request, status } : request
        )
      );

    } catch (error) {
      console.error("Error updating leave request:", error.response?.data || error.message);
      setError("Failed to update leave request.");
    }
  };

  // Display loading message while fetching data
  if (loading) return <p className="text-center text-primary">Loading pending leave requests...</p>;

  // Display error message if an issue occurs
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Pending Leave Requests</h2>
        </div>
        <div className="card-body">
          {leaveRequests.length === 0 ? (
            <p className="text-center text-warning">No pending leave requests found.</p>
          ) : (
            <div className="table-responsive mt-4">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-white">
                  <tr>
                    <th>Leave ID</th>
                    <th>Employee ID</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Approve</th>
                    <th>Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request, index) => (
                    <tr key={index} className="text-center">
                      <td className="fw-bold">{request.leaveId}</td>
                      <td>{request.employeeId}</td>
                      <td>{request.leaveType}</td>
                      <td>{new Date(request.startDate).toLocaleDateString()}</td>
                      <td>{new Date(request.endDate).toLocaleDateString()}</td>
                      <td className={request.status === "APPROVED" ? "text-success fw-bold" : "text-warning fw-bold"}>
                        {request.status}
                      </td>
                      <td>
                        <button
                          className="btn btn-success fw-bold"
                          onClick={() => handleAction(request.leaveId, "APPROVED", request.employeeId)}
                          disabled={request.status === "APPROVED"} 
                        >
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger fw-bold"
                          onClick={() => handleAction(request.leaveId, "REJECTED", request.employeeId)}
                          disabled={request.status === "REJECTED"} 
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingLeaveRequests;
