import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./PhotoEdit.css";
import "../Form.css";

function AlbumEdit({ showEditAlbum, setShowEditAlbum, parentCategoryName,parentCategory, activeAlbum }) {
  let editForm = useRef();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    name: {
      // required: "Nazwa użytkownika nie została wprowadzona ",
    },
    albumname: {
      // required: "Data nie została wprowadzona",
    },
  };

  const onSubmit = async (data) => {
    const apiUrl = "http://localhost:8080/api/edit_category";
    const authToken = sessionStorage.getItem("authToken");
    const postData = {
      parentCategory: data.albumname === "" ? null :data.albumname,
      newNameCategory: data.name,
      idcategory: activeAlbum.idKategorii
    }
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

  const handleError = (errors) => console.log(errors);

  useEffect(() => {
    function handler(e) {
      if (editForm && !editForm.current.contains(e.target)) {
        setShowEditAlbum(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [editForm]);

  useEffect(() => {
    if (showEditAlbum) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setShowEditAlbum(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showEditAlbum, setShowEditAlbum]);

  return (
    <div className="BlurAll">
      <form
        className="Form"
        ref={editForm}
        onSubmit={handleSubmit(onSubmit, handleError)}
      >
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwa albumu: </label>
            <input
              type="text"
              defaultValue={activeAlbum.nazwaKategorii}
              {...register("name", registerOptions.name)}
            />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwa albumu nadrzędnego: </label>
            <input
              type="text"
              {...register("albumname", registerOptions.albumname)}
              defaultValue={parentCategoryName}
            />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <input type="submit" value="Edytuj album" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default AlbumEdit;
