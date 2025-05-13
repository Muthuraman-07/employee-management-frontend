import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
// import "./Shift.css";

const Shift = () => {
  const [allocatedShifts, setAllocatedShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        if (!employeeId) {
          console.error("No employee ID found.");
          return;
        }

        const response = await api.get(`/shift/allocated/${employeeId}`);
        setAllocatedShifts(response.data);

        const availableResponse = await api.get(`/shift/available`);
        setAvailableShifts(availableResponse.data);


      } catch (error) {
        console.error("Error fetching shift data:", error);
      }
    };

    fetchShiftData();
  }, [employeeId]);

  return (
    <div className="shift-dashboard">
      <h2>Shift Management</h2>
      
      <div className="shift-links">
        <button onClick={() => navigate("/createShift")} className="btn btn-warning fw-bold">Create Shift</button>
        <button onClick={() => navigate("/allocatedShift")} className="btn btn-warning fw-bold">Allocated Shift</button>
        <button onClick={() => navigate("/getAllShift")} className="btn btn-warning fw-bold">Available Shift</button>
        <button onClick={() => navigate("/shiftSwap")} className="btn btn-warning fw-bold">Shift Swap</button>
      </div>

    </div>
  );
};

export default Shift;
