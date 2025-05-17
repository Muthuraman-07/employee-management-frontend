import React, { useState } from 'react';
import { api } from '../../service/api';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const ShiftReports = () => {
  const [shiftData, setShiftData] = useState([]);
  const [showHeaders, setShowHeaders] = useState(false); // ✅ Tracks header visibility

  const generateShiftReport = async () => {
    try {
      const response = await api.get('shifts/get-all-shift-records'); // Adjust endpoint as needed
      setShiftData(response.data);
      setShowHeaders(true); // ✅ Show table headers once data is loaded
    } catch (error) {
      console.error('Error fetching shift data:', error);
    }
  };

  return (
    <div className="container mt-4 px-4" style={{ minWidth: '100vh' }}>
      <h2 className="mb-4">Shift Reports</h2>

      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2 text-nowrap" onClick={generateShiftReport}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToPDF('shiftReport')}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToExcel('shiftReport')}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table id="shiftReport" className="table table-bordered table-striped">
          {showHeaders && ( // ✅ Show headers **only** after clicking "Generate Report"
            <thead className="table-dark">
              <tr>
                <th>Shift ID</th>
                <th>Shift Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
          )}
          <tbody>
            {shiftData.map((shift, index) => (
              <tr key={index}>
                <td>{shift.shiftId}</td>
                <td>{shift.shiftDate}</td>
                <td>{shift.shiftStartTime}</td>
                <td>{shift.shiftEndTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftReports;
