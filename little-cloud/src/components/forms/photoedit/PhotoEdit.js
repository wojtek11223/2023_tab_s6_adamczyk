import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./PhotoEdit.css";
import "../Form.css";

function PhotoEdit({ showEditPhoto, setShowEditPhoto, activePhoto }) {
  let editForm = useRef();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    name: {
      // required: "Nazwa użytkownika nie została wprowadzona ",
    },
    date: {
      // required: "Data nie została wprowadzona",
    },
    albumname: {
      //   required: "Nazwa albumu nie została wprowadzona",
    },
    tags: {
      //   required: "Tagi nie zostały dodane",
    },
  };

  const onSubmit = async (data) => {
    console.log(data);
  };

  const handleError = (errors) => console.log(errors);

  useEffect(() => {
    function handler(e) {
      if (editForm && !editForm.current.contains(e.target)) {
        setShowEditPhoto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [editForm]);

  useEffect(() => {
    if (showEditPhoto) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setShowEditPhoto(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showEditPhoto, setShowEditPhoto]);

  return (
    <div className="BlurAll">
      <form
        className="Form"
        ref={editForm}
        onSubmit={handleSubmit(onSubmit, handleError)}
      >
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwa zdjęcia: </label>
            <input
              type="text"
              defaultValue={activePhoto.nazwa.split(".")[0]}
              {...register("name", registerOptions.name)}
            />
          </div>
        </div>

        <div className="InputGroup">
          <div className="InputField">
            <label>Data Wykonania: </label>
            <input type="date" {...register("date", registerOptions.date)} />
          </div>
          {errors?.date && <p>{errors.date.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwa albumu: </label>
            <input
              type="text"
              {...register("albumname", registerOptions.albumname)}
            />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Tagi: </label>
            <input type="text" {...register("tags", registerOptions.tags)} />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <input type="submit" value="Edytuj zdjęcie" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PhotoEdit;
