import React from "react";
import { useForm } from "react-hook-form";
import "./Tile.css";
import Chmurka from "../../../assets/Kot.jpg";

function TileAddCat() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    const postData = {
      albumName: data.albumName,
    };
    console.log(postData);
  };
  const handleError = (errors) => console.log(errors.albumName.message);

  const registerOptions = {
    albumName: { required: "Nazwa albumu nie została wprowadzona" },
  };

  return (
    <form
      className="Tile"
      onSubmit={handleSubmit(handleRegistration, handleError)}
    >
      <div className="Picture">
        <img src={Chmurka} alt="" />
      </div>
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
