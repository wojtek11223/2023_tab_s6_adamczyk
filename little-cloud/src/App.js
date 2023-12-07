import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";

import CloudSmile from "./assets/CloudSmile.svg";
import CloudSad from "./assets/CloudSad.svg";

import "./App.css";
import Menu from "./components/menu/Menu";
import Login from "./components/forms/login/Login";
import Register from "./components/forms/register/Register";
import Albums from "./components/album/Albums";
import Logout from "./components/Logout";
import PhotoUploadForm from "./components/forms/PhotoUpload";


function App() {
  return (
    <BrowserRouter>
      <Menu />
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
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      <img className="Cloud" src={CloudSmile} alt="" />
    </BrowserRouter>
  );
}

export default App;
