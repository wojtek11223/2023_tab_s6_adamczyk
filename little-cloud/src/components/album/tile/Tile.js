import React from "react";
import "./Tile.css";
import Chmurka from "../../../assets/Quiz4.png";

function Tile() {
  return (
    <div className="Tile">
      <div className="Picture">
        <img src={Chmurka} alt="" />
      </div>
      <div className="Text">Nazwa albumu Little Cloud</div>
    </div>
  );
}

export default Tile;
