import { useContext, useState } from "react";
import "./styles/LoginForm.css";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faTimes,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./styles/LoginForm.css";

const LoginForm = () => {
  const { loginUser, registerUser } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const navigate = useNavigate();

  const handleCloseIconClick = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className={isRegistering ? "wrapper register-wrapper" : "wrapper"}>
        <span className="icon-close" onClick={handleCloseIconClick}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <div className="form-box login">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form
            onSubmit={isRegistering === false ? loginUser : registerUser}
            className="login-form"
          >
            <div className="input-box">
              <span className="icon">
                <FontAwesomeIcon icon={faUser} className="login-icon" />
              </span>
              <input type="text" name="username" required />
              <label>Username</label>
            </div>
            {isRegistering && (
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faEnvelope} className="login-icon" />
                </span>
                <input type="email" name="email" required />
                <label>Email</label>
              </div>
            )}
            <div className="input-box">
              <span className="icon">
                <FontAwesomeIcon icon={faLock} className="login-icon" />
              </span>
              <input type="password" name="password" required />
              <label>Password</label>
            </div>
            {isRegistering && (
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faLock} className="login-icon" />
                </span>
                <input type="password" name="confirmPassword" required />
                <label>Confirm Password</label>
              </div>
            )}
            <input
              type="submit"
              className="login-button"
              value={isRegistering ? "Register" : "Login"}
            />
          </form>
          <div className="login-register">
            <p>
              {isRegistering ? "" : "Don't have an account? "}
              <span className="switch-button" onClick={handleToggleForm}>
                {isRegistering ? "Switch to Login" : "Register"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
