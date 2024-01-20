import React, { useEffect, useState } from "react";

import TileAddCat from "./tile/TileAddCat";

import Arrow from "../../assets/arrow.svg";
import ArrowUp from "../../assets/arrowUp.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Tile from "./tile/Tile";
function AlbumsCollection({
  error,
  loading,
  albumsSort,
  handleTileClick,
  forwardedRef,
  showAddCat,
  setShowAddCat,
  setFunny,
  parentCategory,
  setShowEditAlbum,
  setActiveAlbum
}) {
  const [showAlbums, setShowAlbums] = useState(true);

  const handleEditClick = (album) => {
    setShowEditAlbum(true);
    setActiveAlbum(album);
  };
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const handleTileDeleteCategory = (AlbumId) => {
    debugger
    const postData = {
      albumId: AlbumId
    };
    const apiUrl = "http://localhost:8080/api/delete_category";
    const authToken = sessionStorage.getItem("authToken");
    axios
      .post(apiUrl, postData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        parentCategory !== undefined
          ? navigate(`/albums/${parentCategory}`)
          : navigate("/albums");
        window.location.reload();
      })
      .catch((error) => {
        setMessage(
          error.response && error.response.data
            ? error.response.data
            : error.message
        );
        console.error(error);
      });
  };
  return (
    <div className="Collection" ref={forwardedRef}>
      <div className="Title">
        <div className="Text">Albumy:</div>
        <button
          onClick={() => {
            setShowAlbums(!showAlbums);
          }}
        >
          {showAlbums ? (
            <>
              {"Ukryj albumy"} <img src={ArrowUp} alt="" />
            </>
          ) : (
            <>
              {"Pokaż albumy"} <img src={Arrow} alt="" />
            </>
          )}
        </button>
      </div>
      {showAlbums ? (
        <div className="Tiles">
          {showAddCat ? (
            <TileAddCat
              showAddCat={showAddCat}
              setShowAddCat={setShowAddCat}
              parentCategory={parentCategory}
            />
          ) : null}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : albumsSort && albumsSort.length !== 0 ? (
            albumsSort.map((album) => (
              <Tile
                key={album.idKategorii}
                albumName={album.nazwaKategorii}
                handleEditClick={() => handleEditClick(album)}
                onClick={() => handleTileClick(album.idKategorii)}
                handleDeletePhotoClick={() => handleTileDeleteCategory(album.idKategorii)}
              ></Tile>
            ))
          ) : !showAddCat ? (
            <p>Ta kategoria jest pusta</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AlbumsCollection;
