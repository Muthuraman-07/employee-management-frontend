import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is included

// ✅ Import Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null); // ✅ Extracted Manager ID

  const username = localStorage.getItem("username"); // ✅ Get username from local storage

  // ✅ Step 1: Fetch Employee ID using Username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
          },
        });

        setEmployeeId(response.data.employeeId); // ✅ Extracted Manager ID
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

  // ✅ Step 2: Fetch Leave Requests Using Manager ID
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        console.log("Fetching pending leave requests...");
        const response = await api.get(`leave/leave-history-by-status/PENDING/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, 
          },
        });

        console.log("API Response:", response.data);
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

  const handleAction = async (leaveId, status, employeeId) => {
    try {
      console.log(`Updating leave request ID: ${leaveId}, Status: ${status}`);

      await api.patch(`leave/approve-leaveRequest/${leaveId}/${status}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      // ✅ Save approval/rejection in local storage for employee notification
      localStorage.setItem(`leaveRequest_${employeeId}`, status === "APPROVED" ? "APPROVED" : "REJECTED");

      // ✅ Show success notification for the manager
      toast.success(`Leave request ${status === "APPROVED" ? "approved" : "rejected"}! ✅`, {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Update UI after approval/rejection
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
      {/* ✅ Toast Notifications */}
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
