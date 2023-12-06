import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Form.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    const postData = {
      username: data.username,
      password: data.password,
    };
    const apiUrl = "http://localhost:8080/api/login";
    axios
      .post(apiUrl, postData)
      .then((response) => {
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('authName', response.data.username);
        navigate('/albums');
        window.location.reload();
      })
      .catch((error) => {
        // Obsłuż błąd
        setMessage(
          `${
            error.response ? error.response.data.message : "Unknown error"
          }`
        );
        console.log(error.response.status);
      });
  };
  const handleError = (errors) => console.log(errors);

  useEffect(() => {
    // Sprawdź stan sesji lub wykonaj inne operacje po załadowaniu komponentu
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      navigate("/albums");
      console.log('Użytkownik jest zalogowany');
    }
  }, []);

  // const handleClick = () => {
  //   if (password.showPassword === true)
  //     setPassword({ ...password, showPassword: false });
  //   else setPassword({ ...password, showPassword: true });
  // };

  const loginOptions = {
    username: { required: "Nazwa użytkownika nie została wprowadzona" },
    password: {
      required: "Hasło nie zostało wprowadzone",
    },
  };

  return (
    <div className="Container">
      <form className="Form" onSubmit={handleSubmit(handleLogin, handleError)}>
        <div className="Text">
          Zaloguj się :) <p>{message}</p>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="login">Login: </label>
            <input
              type="text"
              id="login"
              {...register("username", loginOptions.username)}
            ></input>
            {errors?.username && <p>{errors.username.message}</p>}
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="password">Hasło: </label>
            <input
              type={passwordShow ? "text" : "password"}
              id="password"
              {...register("password", loginOptions.password)}
            ></input>
            <a onClick={() => setPasswordShow((passwordShow) => !passwordShow)}>
              {<img src={passwordShow ? EyeClose : Eye} alt="" />}
            </a>
          </div>
          {errors?.password && <p>{errors.password.message}</p>}
        </div>
        <input type="submit" value={"Zaloguj się"}></input>
      </form>
    </div>
  );
}

export default Login;
