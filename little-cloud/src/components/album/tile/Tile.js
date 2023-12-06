import React from "react";
import "./Tile.css";
import Chmurka from "../../../assets/Kot.jpg";

function Tile({albumName}) {
  return (
    <div className="Tile">
      <div className="Picture">
        <img src={Chmurka} alt="" />
      </div>
      <div className="Text">
        <p>{albumName}</p>
      </div>
    </div>
  );
}

export default Tile;
