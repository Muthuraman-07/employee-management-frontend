import React, { useState } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "./CreateShift.css"; // Optional styling

const CreateShift = () => {
  const [shift, setShift] = useState({
    shiftId: "",
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!shift.shiftId || !shift.shiftDate || !shift.shiftStartTime || !shift.shiftEndTime) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await api.post("/shifts/create-shift", {
        shiftId: parseInt(shift.shiftId, 10), // Convert to integer
        shiftDate: shift.shiftDate, // YYYY-MM-DD format
        shiftStartTime: `${shift.shiftStartTime}:00`, // Ensuring time format
        shiftEndTime: `${shift.shiftEndTime}:00`, // Ensuring time format
      });

      setMessage("Shift created successfully!");
      setShift({ shiftId: "", shiftDate: "", shiftStartTime: "", shiftEndTime: "" });
    } catch (error) {
      console.error("Error creating shift:", error);
      setMessage("Failed to create shift. Please try again.");
    }
  };

  return (
    <div className="create-shift-container">
      <h2>Create a New Shift</h2>
      <form onSubmit={handleSubmit}>
        <label>Shift ID:</label>
        <input type="number" name="shiftId" value={shift.shiftId} onChange={handleChange} required />

        <label>Shift Date:</label>
        <input type="date" name="shiftDate" value={shift.shiftDate} onChange={handleChange} required />

        <label>Shift Start Time:</label>
        <input type="time" name="shiftStartTime" value={shift.shiftStartTime} onChange={handleChange} required />

        <label>Shift End Time:</label>
        <input type="time" name="shiftEndTime" value={shift.shiftEndTime} onChange={handleChange} required />

        <button type="submit">Create Shift</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateShift;
