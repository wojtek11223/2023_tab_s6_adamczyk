import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloudSmile from "../assets/CloudSmile.svg";

function Logout() {
  const navigate = useNavigate();
  const [authName, setAuthName] = useState(sessionStorage.getItem("authName"));

  useEffect(() => {
    if (authName == null) {
      navigate("/login");
    } else {
      sessionStorage.clear();
      sessionStorage.setItem("Logout" ,"Wylogowano");
    }
    window.location.reload();
  }, []);

  return (
    <div className="Container">
      <div className="Box">
        {authName == null ? (
          <p>Coś poszło nie tak...</p>
        ) : (
          <>
            <p>{"Wylogowano"}</p>
            <img src={CloudSmile} />
          </>
        )}
      </div>
    </div>
  );
}

export default Logout;
