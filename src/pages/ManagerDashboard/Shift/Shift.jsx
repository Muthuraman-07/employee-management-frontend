import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import "./Shift.css";

const Shift = () => {
  const [allocatedShifts, setAllocatedShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [shiftChanges, setShiftChanges] = useState([]);
  const [shiftSwapRequests, setShiftSwapRequests] = useState([]);
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

        const changesResponse = await api.get(`/shift/changes/${employeeId}`);
        setShiftChanges(changesResponse.data);

        const swapResponse = await api.get(`/shift/swap-requests/${employeeId}`);
        setShiftSwapRequests(swapResponse.data);
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
        <button onClick={() => navigate("/create-shift")}>Create Shift</button>
        <button onClick={() => navigate("/allocated-shift")}>Allocated Shift</button>
        <button onClick={() => navigate("/available-shift")}>Available Shift</button>
        <button onClick={() => navigate("/shift-changes")}>Shift Changes</button>
        <button onClick={() => navigate("/shift-swap-requests")}>Shift Swap Requests</button>
      </div>

      {/* <div className="shift-info">
        <h3>Allocated Shifts</h3>
        {allocatedShifts.length > 0 ? (
          <ul>
            {allocatedShifts.map((shift) => (
              <li key={shift.id}>
                {shift.startTime} - {shift.endTime} ({shift.shiftType})
              </li>
            ))}
          </ul>
        ) : (
          <p>No allocated shifts available.</p>
        )}

        <h3>Available Shifts</h3>
        {availableShifts.length > 0 ? (
          <ul>
            {availableShifts.map((shift) => (
              <li key={shift.id}>
                {shift.startTime} - {shift.endTime} ({shift.shiftType})
              </li>
            ))}
          </ul>
        ) : (
          <p>No available shifts.</p>
        )}

        <h3>Shift Changes</h3>
        {shiftChanges.length > 0 ? (
          <ul>
            {shiftChanges.map((change) => (
              <li key={change.id}>
                Requested: {change.requestedShift} - Status: <strong>{change.status}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No shift changes requested.</p>
        )}

        <h3>Shift Swap Requests</h3>
        {shiftSwapRequests.length > 0 ? (
          <ul>
            {shiftSwapRequests.map((swap) => (
              <li key={swap.id}>
                {swap.employeeName} requested swap from {swap.currentShift} to {swap.requestedShift} - <strong>{swap.status}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No shift swap requests.</p>
        )}
      </div> */}
    </div>
  );
};

export default Shift;
