import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const [authName, setAuthName] = useState(sessionStorage.getItem('authName'));

  useEffect(() => {
    if(authName == null) {
      navigate("/login");
    } else {
      sessionStorage.clear();
    }
  }, []);

  return (
    <>
      {authName == null ? (
        <p>Coś poszło nie tak...</p>
      ) : (
        <p>Wylogowano</p>
      )}
    </>
  );
}

export default Logout;