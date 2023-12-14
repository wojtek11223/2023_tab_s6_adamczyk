import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import React, { useState } from "react";

import CloudSmile from "./assets/CloudSmile.svg";
import CloudSad from "./assets/CloudSad.svg";

import "./App.css";
import Menu from "./components/menu/Menu";
import Login from "./components/forms/login/Login";
import Register from "./components/forms/register/Register";
import Albums from "./components/album/Albums";
import Logout from "./components/Logout";
import PhotoUploadForm from "./components/forms/photoupload/PhotoUpload";
import Profile from "./components/forms/profile/Profile";

function App() {
  const [cloudHumor, setCloudHumor] = useState(false);

  return (
    <BrowserRouter>
      <Menu cloudHumor={cloudHumor} setCloudHumor={setCloudHumor} />
      <Routes>
        <Route index element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {sessionStorage.getItem("authName") != null ? (
          <>
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:albumId" element={<Albums />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/photoUpload" element={<PhotoUploadForm />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      {cloudHumor ? (
        <img className="Cloud" src={CloudSad} alt="" />
      ) : (
        <img className="Cloud" src={CloudSmile} alt="" />
      )}
    </BrowserRouter>
  );
}

export default App;
