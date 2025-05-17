import React, { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { api } from "../../../service/api";
import "./CreateShift.css"; 

const CreateShift = () => {
  // ✅ Initializing state for shift details
  const [shift, setShift] = useState({
    shiftId: "",
    shiftDate: null, // Using Date object for better control
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const [message, setMessage] = useState("");

  /**
   * ✅ Function to disable selection of weekends in DatePicker
   * Only allows Monday to Friday selection
   */
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  /**
   * ✅ Handles input field updates
   * Updates shift state when user types into form fields
   */
  const handleChange = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  /**
   * ✅ Handles form submission
   * Ensures proper validation and sends data to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Input validation to ensure no empty fields
    if (!shift.shiftId || !shift.shiftDate || !shift.shiftStartTime || !shift.shiftEndTime) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await api.post("/shifts/create-shift", {
        shiftId: parseInt(shift.shiftId, 10), // Convert to integer for API request
        shiftDate: shift.shiftDate.toISOString().split("T")[0], // Convert Date object to YYYY-MM-DD format
        shiftStartTime: `${shift.shiftStartTime}:00`, // Standardize time format
        shiftEndTime: `${shift.shiftEndTime}:00`, // Standardize time format
      });

      setMessage("Shift created successfully!");
      setShift({ shiftId: "", shiftDate: null, shiftStartTime: "", shiftEndTime: "" });
    } catch (error) {
      console.error("❌ Error creating shift:", error);
      
      // ✅ Improved error handling to provide better feedback
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
        <label>Shift ID:</label>
        <input type="number" name="shiftId" value={shift.shiftId} onChange={handleChange} required />

        <label>Shift Date:</label>
        <DatePicker
          selected={shift.shiftDate}
          onChange={(date) => setShift({ ...shift, shiftDate: date })}
          filterDate={isWeekday} // ✅ Disable weekends dynamically
          dateFormat="yyyy-MM-dd"
          className="form-control"
          required
        />

        <label>Shift Start Time:</label>
        <input type="time" name="shiftStartTime" value={shift.shiftStartTime} onChange={handleChange} required />

        <label>Shift End Time:</label>
        <input type="time" name="shiftEndTime" value={shift.shiftEndTime} onChange={handleChange} required />

        <button type="submit">Create Shift</button>
      </form>

      {/* ✅ Display success or error messages */}
      {message && <p className="alert">{message}</p>}
    </div>
  );
};

export default CreateShift;
