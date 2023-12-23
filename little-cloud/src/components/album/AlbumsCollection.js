import React, { useState } from "react";

import Tile from "./tile/Tile";
import TileAddCat from "./tile/TileAddCat";

function AlbumsCollection({
  error,
  loading,
  albumsSort,
  handleTileClick,
  forwardedRef,
  showAddCat,
  setShowAddCat,
}) {
  return (
    <div className="Collection" ref={forwardedRef}>
      {showAddCat ? <TileAddCat /> : null}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : albumsSort && albumsSort.length !== 0 ? (
        albumsSort.map((album) => (
          <Tile
            key={album.idKategorii}
            albumName={album.nazwaKategorii}
            onClick={() => handleTileClick(album.idKategorii)}
          ></Tile>
        ))
      ) : (
        <p>Ta kategoria jest pusta</p>
      )}
    </div>
  );
}

export default AlbumsCollection;
