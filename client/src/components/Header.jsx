import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <span> | </span>
          <Link to="/mustbeloggedin">Must be logged in</Link>
        </>
      ) : (
        <></>
      )}
      {user && user.role <= 1 ? (
        <>
          <span> | </span>
          <Link to="/mustbemanager">Must be a manager</Link>
        </>
      ) : (
        <></>
      )}

      <span> | </span>
      {user ? (
        <a href="#" onClick={logoutUser}>
          Logout
        </a>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {user && (
        <p>
          Hello [{user.role == 2 ? "Klient" : "Menedżer"}] {user.username}!
        </p>
      )}
    </div>
  );
};

export default Header;
