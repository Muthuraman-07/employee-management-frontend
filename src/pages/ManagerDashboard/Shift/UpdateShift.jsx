import React, { useState } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const UpdateShift = () => {
  const [shiftId, setShiftId] = useState("");
  const [shiftDetails, setShiftDetails] = useState({
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setShiftDetails({ ...shiftDetails, [e.target.name]: e.target.value });
  };

  const handleShiftIdChange = (e) => {
    setShiftId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shiftId) {
      setMessage("Shift ID is required.");
      return;
    }

    try {
      await api.put(`/shifts/update-shift-details/${shiftId}`, shiftDetails);
      setMessage("Shift updated successfully!");
    } catch (error) {
      console.error("Error updating shift:", error);
      setMessage("Failed to update shift. Please try again.");
    }
  };

  return (
    <div className="container mt-5 p-4 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">Update Shift</h2>

      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
        <label className="fw-bold">Shift ID:</label>
        <input type="number" name="shiftId" value={shiftId} onChange={handleShiftIdChange} required className="form-control w-50 mb-3"/>

        <label className="fw-bold">Shift Date:</label>
        <input type="date" name="shiftDate" value={shiftDetails.shiftDate} onChange={handleChange} required className="form-control w-50 mb-3"/>

        <label className="fw-bold">Shift Start Time:</label>
        <input type="time" name="shiftStartTime" value={shiftDetails.shiftStartTime} onChange={handleChange} required className="form-control w-50 mb-3"/>

        <label className="fw-bold">Shift End Time:</label>
        <input type="time" name="shiftEndTime" value={shiftDetails.shiftEndTime} onChange={handleChange} required className="form-control w-50 mb-3"/>

        <button type="submit" className="btn btn-warning fw-bold mt-3">Update Shift</button>
      </form>

      {message && <p className="text-center text-danger mt-3">{message}</p>}
    </div>
  );
};

export default UpdateShift;
