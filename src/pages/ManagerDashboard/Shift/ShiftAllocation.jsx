import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included
// import "./ShiftAllocation.css"
const ShiftAllocation = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [shiftAllocations, setShiftAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username"); // Fetch username from localStorage

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          setError("Username not found.");
          setLoading(false);
          return;
        }

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          console.log("Received Employee ID:", response.data.employeeId);
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
          setError("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setError("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  useEffect(() => {
    const fetchShiftAllocations = async () => {
      if (!employeeId) return;

      try {
        console.log(`Fetching shift allocations for employee ID: ${employeeId}`);
        const response = await api.get(`/shifts/get-shift-by-employee/${employeeId}`);
        setShiftAllocations(response.data);
      } catch (error) {
        console.error("Error fetching shift allocations:", error);
        setError("Error fetching shift allocations.");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftAllocations();
  }, [employeeId]);

  if (loading) return <p className="text-center text-primary">Loading shift allocations...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5 p-4 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">
        Shift Allocations for Employee ID - {employeeId || "Loading..."}
      </h2>

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
