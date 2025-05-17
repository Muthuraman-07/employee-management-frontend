import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";

const Shift = () => {
  const [allocatedShifts, setAllocatedShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        // ✅ Ensure employee ID exists before making API calls
        if (!employeeId) {
          console.error("Error: No employee ID found in local storage.");
          return;
        }

        // ✅ Fetch allocated shifts for the logged-in employee
        const response = await api.get(`/shift/allocated/${employeeId}`);
        setAllocatedShifts(response.data);

        // ✅ Fetch available shifts from the backend
        const availableResponse = await api.get(`/shift/available`);
        setAvailableShifts(availableResponse.data);

      } catch (error) {
        console.error("❌ Error fetching shift data:", error.response?.data || error.message);
      }
    };

    fetchShiftData();
  }, [employeeId]);

  return (
    <div className="shift-dashboard">
      <h2>Shift Management</h2>
      
      <div className="shift-links">
        {/* Button to navigate to allocated shifts */}
        <button onClick={() => navigate("/allocatedShift")}>Allocated Shift</button>
        
        {/* Button to navigate to available shifts */}
        <button onClick={() => navigate("/getAllShift")}>Available Shift</button>
        
        {/* Button to navigate to shift swap page */}
        <button onClick={() => navigate("/shiftSwap")}>Shift Swap</button>
      </div>
    </div>
  );
};

export default Shift;
