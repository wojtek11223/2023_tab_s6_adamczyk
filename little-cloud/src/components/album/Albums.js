import React, {useContext, useEffect} from "react";
import "./Albums.css";
import {useInView} from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';

import Tile from "./tile/Tile";

function Albums() {

  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true, // Powoduje, że hook uruchomi się tylko raz, gdy komponent wejdzie do widoku
  });
  const authToken = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (inView && authToken === null) {
        navigate('/login');
    }
  }, [inView, authToken]);
  return (
    <div className="Collection" ref={ref}>
      {Array.from({ length: 20 }, (value, index) => (
        <Tile key={index} />
      ))}
    </div>
  );
}

export default Albums;
