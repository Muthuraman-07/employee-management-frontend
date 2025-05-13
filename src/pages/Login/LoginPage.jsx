import React, { useEffect , useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../service/UserService' // Import the authenticate function from the service file
import { jwtDecode } from 'jwt-decode';



const LoginPage = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticateUser();
  };

  const authenticateUser = async () => {
    try {
      const response = await authenticate(user);
      if (response && response.token) {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username',user.username);
        const decodedToken = jwtDecode(token);
        console.log('jwtToken', token);
        console.log("Role:",decodedToken.role);
 
        if(decodedToken.role === "ROLE_EMPLOYEE") {
          navigate('/employee');
        }
        else{
          navigate('/manager');
        }
    }
    } catch (error) {
      console.error('Error logging in:', error);
      alert("Invalid username/password....");
    }
  };

  return (
    <div className="whole-login">
      <div className="login-container">
        <div className="login-form">
          <br /><br />
          <h2 style={{ color: "#372c7f" }}>Login to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={user.username}
                onChange={handleInputChange}
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="form-group password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleInputChange}
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <img
                    src="https://img.icons8.com/?size=100&id=Pvdytht8x47l&format=png&color=000000"
                    width="15px"
                    height="15px"
                    className="icon"
                    alt="Hide"
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/?size=100&id=60022&format=png&color=000000"
                    width="15px"
                    height="15px"
                    className="icon"
                    alt="Show"
                  />
                )}
              </span>
            </div>
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </div>
        <div className="login-info">
          <img src="/logo.gif" alt="sample" />
        </div>
      </div>
    </div>
  );
};



export default LoginPage;
