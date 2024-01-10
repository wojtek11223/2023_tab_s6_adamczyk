import React from "react";
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
                <li>
                  <img src={MenuButton} alt="" />
                </li>
                <li>
                  <a href="/">Strona główna</a>
                </li>
                <li>
                  <a onClick={this.handleClick} href={() => false}>
                    Chmurka
                  </a>
                </li>
              </ul>
              <ul className="Right">
                <li>
                  <a href="/register">Zarejestruj się</a>
                </li>
                <li>
                  <a href="/login">Zaloguj się</a>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="Left">
                <li>
                  <a href="/">Strona główna</a>
                </li>
                <li>
                  <a href="/albums">Albumy</a>
                </li>
                <li>
                  <a href="/photoUpload">Dodaj zdjęcie</a>
                </li>
                <li>
                  <a onClick={this.handleClick} href={() => false}>
                    Chmurka
                  </a>
                </li>
              </ul>
              <ul className="Right">
                <li>
                  <a href="/logout">Wyloguj się</a>
                </li>
                <li>
                  <a href="/profile">Witaj {authName}</a>
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
