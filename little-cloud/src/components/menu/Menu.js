import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuSmall from "./MenuSmall";
import "./Menu.css";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    // Inicjalizacja stanu
    this.state = {
      authName: null,
      showLeftMenu: false,
      showRightMenu: false,
    };
  }

  componentDidMount() {
    this.setState({
      authName: sessionStorage.getItem("authName"),
    });
  }

  handleClick = () => {
    const { cloudHumor } = this.props;
    this.props.setCloudHumor(!cloudHumor);
  };

  render() {
    const { authName } = this.state;
    return (
      <React.Fragment>
        <MenuSmall authName={authName} handleClick={this.handleClick} />
        <div className="Menu">
          {authName == null ? (
            <>
              <ul className="Left">
                {/* <li>
                  <img src={MenuButton} alt="" />
                </li> */}
                <li>
                  <Link to="/mainpage">
                    <button>Strona główna</button>
                  </Link>
                </li>
                <li>
                  <button onClick={this.handleClick}>Chmurka</button>
                </li>
                <li>
                  <Link to="/help">
                    <button>Pomoc</button>
                  </Link>
                </li>
              </ul>
              <ul className="Right">
                <li>
                  <Link to="/register">
                    <button>Zarejestruj się</button>
                  </Link>
                </li>
                <li>
                  <Link to="/login">
                    <button>Zaloguj się</button>
                  </Link>
                </li>
              </ul>
              <div className="SelectMenu"></div>
            </>
          ) : (
            <>
              <ul className="Left">
                <li>
                  <Link to="/mainpage">
                    <button>Strona główna</button>
                  </Link>
                </li>
                <li>
                  <Link to="/albums">
                    <button>Albumy</button>
                  </Link>
                </li>
                <li>
                  <button onClick={this.handleClick}>Chmurka</button>
                </li>
                <li>
                  <Link to="/help">
                    <button>Pomoc</button>
                  </Link>
                </li>
              </ul>
              <ul className="Right">
                <li>
                  <Link to="/logout">
                    <button>Wyloguj się</button>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <button>Witaj {authName}</button>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
