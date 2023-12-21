import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Form.css";

function AddCategory() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCategory = (data) => {
    console.log(data);
    const postData = {
      category: data.category,
      parentCategory: data.parentCategory,
    };
    const apiUrl = "http://localhost:8080/api/add_category";
    const authToken = sessionStorage.getItem("authToken");
    debugger;
    axios
      .post(apiUrl, postData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        setMessage(
          `${error.response ? error.response.data.message : "Problem"}`
        );
        console.log(error);
      });
  };
  const handleError = (errors) => console.log(errors);

  const registerOptions = {
    category: {
      required: "Adres e-mail nie został wprowadzony",
    },
    parentCategory: {
      required: "Hasło nie zostało wprowadzone",
    },
  };

  return (
    <div className="Container">
      <form
        className="Form"
        onSubmit={handleSubmit(handleCategory, handleError)}
      >
        <div className="Text">
          Dodaj kategorię <p>{message}</p>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="category">Nazwa kategorii: </label>
            <input
              type="text"
              id="category"
              {...register("category", registerOptions.category)}
            ></input>
            {errors?.username && <p>{errors.username.message}</p>}
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="parentCategory">Nazwa kategorii nadrzędnej: </label>
            <input
              type="text"
              id="parentCategory"
              {...register("parentCategory", registerOptions.parentCategory)}
            ></input>
          </div>
          {errors?.password && <p>{errors.password.message}</p>}
        </div>
        <input type="submit" value={"Dodaj kategorię"}></input>
      </form>
    </div>
  );
}

export default AddCategory;
