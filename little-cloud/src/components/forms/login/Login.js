import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../Form.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function Login() {
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
    // Wywołaj API za pomocą Axios
    axios
      .post(apiUrl, postData)
      .then((response) => {
        setMessage(`Zalogowano Token: ${response.data.token}`);
      })
      .catch((error) => {
        // Obsłuż błąd
        setMessage(
          `Login failed. ${
            error.response ? error.response.data.message : "Unknown error"
          }`
        );
        console.log(error.response.status);
      });
  };
  const handleError = (errors) => console.log(errors);

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
