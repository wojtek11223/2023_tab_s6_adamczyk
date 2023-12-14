import React from "react";
import "./Tile.css";
import Chmurka from "../../../assets/Kot.jpg";

function Tile({ albumName, onClick, image }) {
  const handleTileClick = () => {
    if (onClick) {
      onClick(); // Execute the onClick function passed as a prop
    }
  };

  return (
    <div className="Tile" onClick={handleTileClick}>
      <div className="Picture">
        <img
          src={image ? `data:image/jpeg;base64,${image.zdjecie}` : Chmurka}
          alt=""
        />
      </div>
      <div className="Text">
        <p>{albumName}</p>
      </div>
    </div>
  );
}

export default Tile;
