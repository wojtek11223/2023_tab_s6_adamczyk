import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import ChmurkaDuza from "./assets/ChmurkaNot.svg";

import "./App.css";
import Menu from "./components/menu/Menu";
import Login from "./components/forms/login/Login";
import Register from "./components/forms/register/Register";
import Albums from "./components/album/Albums";

function App() {
  return (
    <>
      <Menu />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/albums" element={<Albums />} />
        </Routes>
      </BrowserRouter>
      <img className="ChmurkaDuza" src={ChmurkaDuza} alt="" />
    </>
  );
}

export default App;
