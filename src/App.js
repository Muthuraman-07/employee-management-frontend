import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard.js';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/EmployeeDashboard/Profile.jsx';
import CreateEmployee from './pages/ManagerDashboard/CreateEmployee.jsx';
import ViewEmployee from './pages/ManagerDashboard/ViewEmployee.jsx';
import Leave from './pages/ManagerDashboard/Leave/Leave.jsx';
import Attendance from './pages/ManagerDashboard/Attendance/MarkAttendance.jsx';
import Shift from './pages/ManagerDashboard/Shift/Shift.jsx';
import ApplyLeave from './pages/ManagerDashboard/Leave/ApplyLeave.jsx';
import LeaveRequests from './pages/ManagerDashboard/Leave/LeaveRequests.jsx';
function App() {
  // const token = localStorage.getItem('token');
  // const role = localStorage.getItem('role');

  return (
    <div className="App">
      <Router>
      <div className="app-content">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createEmployee" element={<CreateEmployee />} />
        <Route path="/viewEmployee" element={<ViewEmployee />} />
        <Route path="/leave" element={<Leave />} />
         <Route path="/applyLeave" element={<ApplyLeave />} />
        <Route path="/leaveRequests" element={<LeaveRequests />} /> 
         <Route path="/attendance" element={<Attendance />} />
         <Route path="/shift" element={<Shift />} />
      </Routes>
      </div>
      
    </Router>
    </div>
    
  );
}

export default App;

