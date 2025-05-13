import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const ShiftSwap = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [shiftId, setShiftId] = useState("");
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username"); // Fetch username from localStorage

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          setMessage("Username not found.");
          return;
        }

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          setEmployeeId(response.data.employeeId);
        } else {
          setMessage("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setMessage("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  const handleChange = (e) => {
    setShiftId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !shiftId) {
      setMessage("Both Employee ID and Shift ID are required.");
      return;
    }

    try {
      console.log(`Sending swap request for Employee ID: ${employeeId}, Shift ID: ${shiftId}`);
      await api.post("/shifts/request-swap", null, {
        params: { employeeId, shiftId }, // ✅ Pass parameters correctly
      });

      setMessage("Shift swap request submitted successfully!");
    } catch (error) {
      console.error("Error requesting shift swap:", error);
      setMessage("Failed to submit swap request. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Request Shift Swap</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="mb-3 w-50">
              <label className="form-label fw-bold">Shift ID:</label>
              <input type="number" name="shiftId" value={shiftId} onChange={handleChange} required className="form-control"/>
            </div>

            <button type="submit" className="btn btn-warning fw-bold mt-3">Submit Swap Request</button>
          </form>

          {message && <p className="text-center text-danger mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShiftSwap;
