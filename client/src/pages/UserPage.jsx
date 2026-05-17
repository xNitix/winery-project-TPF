import { Link } from "react-router-dom";
import OrderTable from "../components/OrderTable";
import UserProfile from "../components/UserProfile";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./UserPage.css";

const UserPage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="UserPageContainer">
      <h1 className="UserPageHeading">User Page</h1>
      {user.role === 1 && (
        <Link to="/managerpanel">
          <button className="admin-button">Admin Panel</button>
        </Link>
      )}

      <UserProfile />
      <OrderTable />
    </div>
  );
};

export default UserPage;
