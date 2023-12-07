import React, { useState, useEffect } from "react";
import "./Albums.css";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useParams } from "react-router-dom";

import Tile from "./tile/Tile";

function Albums() {
  
  const navigate = useNavigate();
  const [allalbums, setAlllbums] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [loading, setLoading] = useState(true);
  const { albumId } = useParams();
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (inView && loading) {
      let apiURL;
      if(albumId === undefined) {
        apiURL = "http://localhost:8080/api/albums";
      }
      else {
        apiURL = `http://localhost:8080/api/album/${albumId}`;
      }

      axios({
        url: apiURL,
        method: "get",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
        },
      })
        .then((response) => {
          setAlbums(response.data);
          setAlllbums(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [inView, authToken, loading]);

  useEffect(() => {
    const handlePopstate = () => {
      window.location.reload();
    };

    // Dodaj nasłuchiwanie na zdarzenie popstate
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handleTileClick = (albumId) => {
    navigate(`/albums/${albumId}`);
    window.location.reload();
  };

  return (
    <div className="Collection" ref={ref}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        albums &&
        albums.length != 0 ? (
          albums.map((album) => (
            <Tile
              key={album.id}
              albumName={album.nazwaKategorii}
              onClick={() => handleTileClick(album.idKategorii)}
            ></Tile>
          )) 
        ) : (
          <p>Ta kategoria jest pusta</p>
        )
      )}
    </div>
  );
}

export default Albums;