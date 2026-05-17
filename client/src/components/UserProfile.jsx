import { useContext, useEffect, useState } from "react";
import "./styles/UserProfile.css";
import AuthContext from "../context/AuthContext";

const UserProfile = () => {
  const [userData, setUserData] = useState([]);
  const { user, authTokens } = useContext(AuthContext);

  const getProfile = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.ok) {
        let data = await response.json();
        let filteredData = data.filter((item) => item.id === user.user_id);
        setUserData(filteredData.length > 0 ? filteredData[0] : {});
      } else {
        console.error("Failed to fetch profile:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching profile:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, [user.id, authTokens.access]);

  console.log(userData);

  return (
    <>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role}</p>
      <h1>Orders History</h1>
    </>
  );
};

export default UserProfile;
