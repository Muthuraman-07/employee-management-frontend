import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
// import "./Shift.css";

const Shift = () => {
  const navigate = useNavigate();
  // Retrieve employee ID from local storage
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    /**
     * Fetch shift data for the logged-in employee.
     * This includes both allocated shifts and available shifts.
     */
    const fetchShiftData = async () => {
      try {
        // Check if employee ID exists in local storage
        if (!employeeId) {
          console.error("No employee ID found in local storage.");
          alert("Employee ID is missing. Please log in again.");
          return;
        }

      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching shift data:", error);

        // Display a user-friendly error message
        alert("Failed to fetch shift data. Please try again later.");
      }
    };

    fetchShiftData();
  }, [employeeId]);

  return (
    <div className="shift-dashboard">
      <h2>Shift Management</h2>
      
      <div className="shift-links">
        {/* Navigation buttons for shift management */}
        <button onClick={() => navigate("/allocatedShift")} className="btn btn-warning fw-bold">Allocated Shift</button>
        <button onClick={() => navigate("/getAllShift")} className="btn btn-warning fw-bold">Available Shift</button>
        <button onClick={() => navigate("/shiftSwap")} className="btn btn-warning fw-bold">Shift Swap</button>
      </div>
    </div>
  );
};

export default Shift;
