import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import MenuButton from "../../assets/MenuButton.svg";

class Menu extends React.Component {
  constructor(props) {
    super(props);

    // Inicjalizacja stanu
    this.state = {
      authName: null,
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
