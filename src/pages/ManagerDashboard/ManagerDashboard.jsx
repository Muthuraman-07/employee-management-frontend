import React, { useEffect } from 'react';
import './ManagerDashboard.css';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken'); // Remove token if stored
    console.log("removed");
    navigate('/'); // Navigate to login page
  };

  useEffect(() => {
      window.history.pushState(null, "", window.location.href);
      
      const handleBackButton = (event) => {
        event.preventDefault();
        window.history.pushState(null, "", window.location.href);
        console.log("Back button disabled!");
      };
  
      window.addEventListener("popstate", handleBackButton);
  
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }, []);

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar">
      
        <ul>
          <li onClick={() => navigate('/createEmployee')} className="active"><i className="icon"></i>Register Employee</li>
          <li onClick={() => navigate('/viewEmployee')}><i className="icon"></i> View Employees</li>
          <li onClick={() => navigate('/attendance')}><i className="icon"></i> Attendance</li>
          <li onClick={() => navigate('/leave')}><i className="icon"></i> Leaves</li>
          <li onClick={() => navigate('/shift')}><i className="icon"></i> Shifts</li>
          <li onClick={() => navigate('/reports')}><i className="icon"></i> Reports</li>
          <li onClick={() => navigate('/profile')}><i className="icon"></i> Profile</li>
          <li className="logout-button" onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      {/* <div className="main-content">
        <h2>About Company</h2>
        <div className="content">
  <img src="/manager.jpg" alt="Presentation Board" />
  
  <p>
    As a global leader in digital transformation and technology solutions, we drive innovation, deliver strategic consulting, and empower businesses worldwide.
  </p>

  <h3>Our Vision & Mission</h3>
  <p>
    We envision a world where technology seamlessly integrates with human potential to create meaningful solutions. Guided by our mission to accelerate progress, we focus on harnessing emerging technologies to transform enterprises and create sustainable models.
  </p>

  <h3>Core Values</h3>
  <ul>
    <li><strong>Innovation:</strong> Continuous improvements through AI and automation.</li>
    <li><strong>Integrity:</strong> Trust and transparency in every engagement.</li>
    <li><strong>Collaboration:</strong> Partnering with businesses to drive impactful solutions.</li>
    <li><strong>Sustainability:</strong> Committing to responsible business practices.</li>
  </ul>

  <h3>Industry Expertise</h3>
  <ul>
    <li><strong>Healthcare:</strong> Transforming patient care with data-driven insights.</li>
    <li><strong>Finance:</strong> Enhancing banking operations with secure cloud solutions.</li>
    <li><strong>Retail:</strong> Personalizing customer experiences through AI analytics.</li>
  </ul>

  <h3>Technology Innovations</h3>
  <ul>
    <li>Cloud computing for seamless enterprise scalability.</li>
    <li>AI-driven automation to enhance efficiency.</li>
    <li>Advanced cybersecurity to protect businesses.</li>
    <li>Blockchain integration for secure transactions.</li>
    <li>IoT deployments for optimizing real-time operations.</li>
  </ul>

  <h3>Commitment to Sustainability</h3>
  <ul>
    <li><strong>Eco-friendly Infrastructure:</strong> Reducing carbon footprint with energy-efficient solutions.</li>
    <li><strong>Corporate Social Responsibility (CSR):</strong> Supporting community and global sustainability.</li>
    <li><strong>Ethical AI Practices:</strong> Ensuring transparency and accountability in AI development.</li>
  </ul>

  <h3>Looking Ahead</h3>
  <p>
    As businesses navigate digital transformation, we remain committed to pioneering scalable, secure, and forward-thinking solutions that create lasting impacts.
  </p>

  <h3>Join the Journey</h3>
  <p>
    Whether you're seeking world-class technology services, innovative consulting, or a transformative career, we invite you to be part of the digital revolution.
  </p>
</div>

      </div> */}
    </div>
  );
};

export default ManagerDashboard;
