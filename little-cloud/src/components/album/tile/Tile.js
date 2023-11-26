import React from "react";
import "./Tile.css";
import Chmurka from "../../../assets/Kot.jpg";

function Tile() {
  return (
    <div className="Tile">
      <div className="Picture">
        <img src={Chmurka} alt="" />
      </div>
      <div className="Text">
        <p>Nazwa albumu Little Cloud</p>
      </div>
    </div>
  );
}

export default Tile;
