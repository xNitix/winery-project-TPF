import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const LoggedInPage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <p>You must be logged in to see this page!</p>
    </div>
  );
};

export default LoggedInPage;
