import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import "./ShiftAllocation.css";

const ShiftAllocation = () => {
  // State variables to manage employee ID and shift allocations
  const [employeeId, setEmployeeId] = useState(null);
  const [shiftAllocations, setShiftAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  // Fetch employee ID based on username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          setError("Username not found.");
          setLoading(false);
          return;
        }

        const response = await api.get(`employee/employee-username/${username}`);
        if (response.data && response.data.employeeId) {
          setEmployeeId(response.data.employeeId);
        } else {
          setError("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error.response?.data || error.message);
        setError("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  // Fetch shift allocations once employee ID is retrieved
  useEffect(() => {
    const fetchShiftAllocations = async () => {
      if (!employeeId) return;

      try {
        const response = await api.get(`/shifts/get-shift-by-employee/${employeeId}`);
        setShiftAllocations(response.data);
      } catch (error) {
        console.error("Error fetching shift allocations:", error.response?.data || error.message);
        setError("Error fetching shift allocations.");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftAllocations();
  }, [employeeId]);

  // Display loading message while fetching data
  if (loading) return <p className="text-center text-primary">Loading shift allocations...</p>;

  // Display error message if an issue occurs
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5 p-4 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">
        Shift Allocations for Employee ID - {employeeId || "Loading..."}
      </h2>

      {/* Display message if no shift allocations are found */}
      {shiftAllocations.length === 0 ? (
        <p className="text-center text-warning fw-bold">No shift allocations found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover mt-3">
            <thead className="table-dark text-white">
              <tr>
                <th className="text-center">Shift ID</th>
                <th className="text-center">Shift Date</th>
                <th className="text-center">Shift Start Time</th>
                <th className="text-center">Shift End Time</th>
              </tr>
            </thead>
            <tbody>
              {shiftAllocations.map((shift, index) => (
                <tr key={index} className="text-center">
                  <td className="fw-bold">{shift.shiftId}</td>
                  <td className="fw-semibold text-primary">{shift.shiftDate}</td>
                  <td className="text-success">{shift.shiftStartTime}</td>
                  <td className="text-danger">{shift.shiftEndTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShiftAllocation;
