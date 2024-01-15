import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";

import { useForm } from "react-hook-form";
import "./Tile.css";

function TileAddCat({ showAddCat, setShowAddCat, parentCategory }) {
  const navigate = useNavigate();

  let tileRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (tileRef && !tileRef.current.contains(e.target)) {
        setShowAddCat(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [tileRef, setShowAddCat]);

  useEffect(() => {
    if (showAddCat) {
      const handleEsc = (event) => {
        if (event.key === "Escape") {
          setShowAddCat(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showAddCat, setShowAddCat]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState(null);

  const handleRegistration = (data) => {
    console.log(data);
    const postData = {
      category: data.albumName,
      parentCategory: parentCategory !== undefined ? parentCategory : null,
    };
    const apiUrl = "http://localhost:8080/api/add_category";
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

  const registerOptions = {
    albumName: { required: "Nazwa albumu nie została wprowadzona" },
  };

  const handleError = (errors) => console.log(errors);
  return (
    <form
      className="Tile"
      onSubmit={handleSubmit(handleRegistration, handleError)}
      ref={tileRef}
    >
      {message ? message : <></>}
      <div className="InputField">
        <input
          id="albumName"
          type={"text"}
          placeholder="Wpisz nazwę albumu"
          autoFocus
          {...register("albumName", registerOptions.albumName)}
        />
      </div>
    </form>
  );
}

export default TileAddCat;
