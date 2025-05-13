import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const ShiftSwapRequests = () => {
  const [shiftRequests, setShiftRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShiftRequests = async () => {
      try {
        console.log("Fetching pending shift swap requests...");
        const response = await api.get("/shifts/request-status", { params: { status: "PENDING" } });
        console.log("API Response:", response.data); // ✅ Debugging Response
        setShiftRequests(response.data);
      } catch (error) {
        console.error("Error fetching shift swap requests:", error);
        setError("Failed to fetch shift swap requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftRequests();
  }, []);

  const handleAction = async (requestId, approved) => {
    try {
      console.log(`Updating shift request ID: ${requestId}, Approved: ${approved}`);

      await api.post("/shifts/approve-swap", null, { params: { requestId, approved } });

      // Updating UI after approval/rejection by changing status dynamically
      setShiftRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: approved ? "APPROVED" : "REJECTED", approvedByManager: !!approved }
            : request
        )
      );

    } catch (error) {
      console.error("Error updating shift request:", error);
      setError("Failed to update shift request.");
    }
  };

  if (loading) return <p className="text-center text-primary">Loading pending shift requests...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Pending Shift Swap Requests</h2>
        </div>
        <div className="card-body">
          {shiftRequests.length === 0 ? (
            <p className="text-center text-warning">No pending shift swap requests found.</p>
          ) : (
            <div className="table-responsive mt-4">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-white">
                  <tr>
                    <th>Request ID</th>
                    <th>Requested Shift ID</th>
                    <th>EmployeeId</th>
                    <th>Status</th>
                    <th>Approve</th>
                    <th>Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftRequests.map((request, index) => (
                    <tr key={index} className="text-center">
                      <td className="fw-bold">{request.id}</td>
                      <td>{request.requestedShiftId}</td> {/* ✅ Uses DTO Property */}
                      <td>{request.employee.employeeId}</td>
                      <td className={request.status === "APPROVED" ? "text-success fw-bold" : "text-warning fw-bold"}>
                        {request.status}
                      </td>
                      <td>
                        <button
                          className="btn btn-success fw-bold"
                          onClick={() => handleAction(request.id, 1)}
                          disabled={request.status === "APPROVED"} // ✅ Disable if already approved
                        >
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger fw-bold"
                          onClick={() => handleAction(request.id, 0)}
                          disabled={request.status === "REJECTED"} // ✅ Disable if already rejected
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

export default ShiftSwapRequests;
