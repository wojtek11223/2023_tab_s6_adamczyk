import React, {useState, useEffect} from "react";
import "./Albums.css";
import {useInView} from "react-intersection-observer";
import axios from "axios";

import Tile from "./tile/Tile";

function Albums() {
  const [albums, setAlbums] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true, // Powoduje, że hook uruchomi się tylko raz, gdy komponent wejdzie do widoku
  });
  const authToken = sessionStorage.getItem('authToken');
  const config = {
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${authToken}`,
    }
  };
  useEffect(() => {
    if (inView) {
      const apiUrl = 'http://localhost:8080/api/albums';
      axios({ 
          url: 'http://localhost:8080/api/albums',
          method:'get',
          headers : {
              Authorization : `Bearer ${authToken}`,
              Accept: '*/*'
          }
      })
        .then((response) => {
          setAlbums(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [inView, authToken]);
  return (
    <div className="Collection" ref={ref}>
      {albums ? albums.map(album => 
        <Tile albumName={album.nazwaKategorii}></Tile>
      ) : <></>}
    </div>
  );
}

export default Albums;
