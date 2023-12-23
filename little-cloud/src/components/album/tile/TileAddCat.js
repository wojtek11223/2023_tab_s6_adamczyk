import React, { useState } from "react";
import "./Tile.css";
import Chmurka from "../../../assets/Kot.jpg";

function TileAddCat() {
  return (
    <form className="Tile">
      <div className="Picture">
        <img src={Chmurka} alt="" />
      </div>
      <div className="InputField">
        <input type={"text"} placeholder="Wpisz nazwę albumu" />
      </div>
    </form>
  );
}

export default TileAddCat;
