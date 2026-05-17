import { useContext } from "react";
import "./UserModal.css";
import AuthContext from "../../context/AuthContext";

const UserModal = ({ onClose }) => {
  const { loginUser } = useContext(AuthContext);
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="user-modal">
      {user && user.role >= 1 ? (
        <div>
          <p>Logged in as {user.username}</p>
          <button onClick={logoutUser}>Logout</button>
          <button onClick={onClose} className="close-modal">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={loginUser}>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>

          <button onClick={onClose} className="close-modal">
            Close
          </button>
        </form>
      )}
    </div>
  );
};

export default UserModal;
