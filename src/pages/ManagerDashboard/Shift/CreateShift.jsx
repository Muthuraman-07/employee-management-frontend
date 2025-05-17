import React, { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { api } from "../../../service/api";
import "./CreateShift.css"; 

const CreateShift = () => {
  // State for shift details
  const [shift, setShift] = useState({
    shiftId: "",
    shiftDate: null, 
    shiftStartTime: "",
    shiftEndTime: "",
  });

  // State for error and success messages
  const [message, setMessage] = useState("");

  // Function to disable selection of weekends in DatePicker
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Handles input field updates
  const handleChange = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  // Handles form submission with validation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled before submitting
    if (!shift.shiftId || !shift.shiftDate || !shift.shiftStartTime || !shift.shiftEndTime) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await api.post("/shifts/create-shift", {
        shiftId: parseInt(shift.shiftId, 10),
        shiftDate: shift.shiftDate.toISOString().split("T")[0], 
        shiftStartTime: `${shift.shiftStartTime}:00`, 
        shiftEndTime: `${shift.shiftEndTime}:00`, 
      });

      setMessage("Shift created successfully!");
      setShift({ shiftId: "", shiftDate: null, shiftStartTime: "", shiftEndTime: "" });
    } catch (error) {
      console.error("Error creating shift:", error.response?.data || error.message);

      // Improved error handling to provide better feedback
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || "Failed to create shift."}`);
      } else {
        setMessage("Network error: Unable to reach the server.");
      }
    }
  };

  return (
    <div className="create-shift-container">
      <h2>Create a New Shift</h2>
      <form onSubmit={handleSubmit}>
        {/* Shift ID Input */}
        <label>Shift ID:</label>
        <input type="number" name="shiftId" value={shift.shiftId} onChange={handleChange} required />

        {/* Shift Date Picker */}
        <label>Shift Date:</label>
        <DatePicker
          selected={shift.shiftDate}
          onChange={(date) => setShift({ ...shift, shiftDate: date })}
          filterDate={isWeekday} 
          dateFormat="yyyy-MM-dd"
          className="form-control"
          required
        />

        {/* Shift Start Time Input */}
        <label>Shift Start Time:</label>
        <input type="time" name="shiftStartTime" value={shift.shiftStartTime} onChange={handleChange} required />

        {/* Shift End Time Input */}
        <label>Shift End Time:</label>
        <input type="time" name="shiftEndTime" value={shift.shiftEndTime} onChange={handleChange} required />

        {/* Submit Button */}
        <button type="submit">Create Shift</button>
      </form>

      {/* Display success or error messages */}
      {message && <p className="alert">{message}</p>}
    </div>
  );
};

export default CreateShift;
