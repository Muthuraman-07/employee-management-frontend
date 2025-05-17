import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; 

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null); 

  const username = localStorage.getItem("username"); 

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
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

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
        console.error("Error fetching leave requests:", error);
        setError("Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchLeaveRequests();
    }
  }, [employeeId]);

  useEffect(() => {
    // ✅ Notify employee when logging in
    const savedStatus = localStorage.getItem(`leaveRequest_${employeeId}`);
    if (savedStatus) {
      toast.info(`Your leave request has been ${savedStatus.toLowerCase()}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Remove notification after displaying
      localStorage.removeItem(`leaveRequest_${employeeId}`);
    }
  }, [employeeId]);

  const handleAction = async (leaveId, status, employeeId) => {
    try {
      await api.patch(`leave/approve-leaveRequest/${leaveId}/${status}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      // ✅ Save status for employee notification
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
      console.error("Error updating leave request:", error);
      setError("Failed to update leave request.");
    }
  };

  if (loading) return <p className="text-center text-primary">Loading pending leave requests...</p>;
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
