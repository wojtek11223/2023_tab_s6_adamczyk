import React from "react";
import "./Albums.css";

import Tile from "./tile/Tile";

function Albums() {
  return (
    <div className="Collection">
      {Array.from({ length: 20 }, (value, index) => (
        <Tile key={index} />
      ))}
    </div>
  );
}

export default Albums;
