import React from "react";
import "./Tile.css";
import Close from "../../../assets/close.svg";
import Edit from "../../../assets/edit.svg";

function Tile({
  albumName,
  image,
  handlePhotoClick,
  handleEditClick,
  handleDeletePhotoClick,
  onClick,
}) {
  const handleTileClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleTileEditClick = () => {
    if (handleEditClick) {
      handleEditClick();
    }
  };

  const handleRemoveClick = () => {
    if (handleDeletePhotoClick) {
      if (window.confirm("Czy na pewno chcesz usunąć to zdjęcie?")) {
        handleDeletePhotoClick();
      }
    }
  };

  return (
    <div className="Tile">
      <div className="Buttons">
        <button className="Edit" onClick={handleTileEditClick}>
          <img src={Edit} />
        </button>
        <button className="Remove" onClick={handleRemoveClick}>
          <img src={Close} />
        </button>
      </div>
      {image ? (
        <div className="Picture" onClick={handleTileClick}>
          <img
            src={
              image ? `data:${image.format};base64,${image.miniaturka}` : null
            }
            alt=""
          />
        </div>
      ) : (
        ""
      )}

      <div className="Text" onClick={handleTileClick}>
        <p>{albumName}</p>
      </div>
    </div>
  );
}

export default Tile;
