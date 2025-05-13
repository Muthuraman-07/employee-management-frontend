import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const GetAllShift = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllShifts = async () => {
      try {
        console.log("Fetching all shift records...");
        const response = await api.get("/shifts/get-all-shift-records");
        setShifts(response.data);
        console.log("Successfully fetched all shifts.");
      } catch (error) {
        console.error("Error fetching shift records:", error);
        setError("Error fetching shift records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllShifts();
  }, []);

  if (loading) return <p className="text-center text-primary">Loading shift records...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5 p-4 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">All Shift Records</h2>

      {shifts.length === 0 ? (
        <p className="text-center text-warning fw-bold">No shift records found.</p>
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
              {shifts.map((shift, index) => (
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

export default GetAllShift;
