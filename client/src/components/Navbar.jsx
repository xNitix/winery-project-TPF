import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faSearch,
  faUser,
  faHeart,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import "./styles/Navbar.css";
import { Link } from "react-router-dom";

import CartModal from "./modals/CartModal";
import { CartContext } from "../context/CartContext";
import AuthContext from "../context/AuthContext";

import logoImage from "../assets/wine-store-logo-crop.png";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const cartItems = useContext(CartContext);

  const totalItemsInCart = cartItems.reduce((total, item) => {
    const itemQuantity = parseInt(item.quantity) || 0;
    return total + itemQuantity;
  }, 0);

  const [cartModalIsOpen, setCartModalIsOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/store?search=${searchTerm}`);
  };

  return (
    <header className="header">
      <div className="top-bar">
        <div className="navbar-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
          <span>Cracow</span>
        </div>
        <div className="navbar-links">
          <Link to="/">
            <strong>Home</strong>
          </Link>
          <Link to="/store">
            <strong>Store</strong>
          </Link>
          <Link to="/about-us">
            <strong>About Us</strong>
          </Link>
        </div>
        <div className="navbar-contact">
          {user ? (
            <div className="log-out-button" onClick={logoutUser}>
              <strong>Log out</strong>
            </div>
          ) : (
            <Link to={"/login"}>
              <strong>Sign in</strong>
            </Link>
          )}
        </div>
      </div>
      <div className="main-bar">
        <Link to={"/"}>
          <div className="navbar-logo">
            <img
              src={logoImage}
              alt="Icon Description"
              width="50"
              height="50"
            />
            <span>WORLD OF WINE</span>
          </div>
        </Link>
        <div>
          <div className="search-container">
            <div
              className="navbar-search"
              style={{ display: !isLoginPage ? "block" : "none" }}
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for wines..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button type="submit">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="navbar-icons">
          <div className="icon-container">
            {user && (
              <Link to="/favorites">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="heart-icon"
                  style={{ display: !isLoginPage ? "block" : "none" }}
                />
              </Link>
            )}
          </div>

          <div className="icon-container">
            <div
              className="cart-icon-container"
              onClick={() => setCartModalIsOpen(!cartModalIsOpen)}
              style={{ display: !isLoginPage ? "block" : "none" }}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
              {totalItemsInCart > 0 && totalItemsInCart < 100 && (
                <div className="cart-badge">{totalItemsInCart}</div>
              )}
              {totalItemsInCart >= 100 && (
                <div className="cart-badge99">+99</div>
              )}
            </div>
          </div>

          {cartModalIsOpen && (
            <CartModal
              isOpen={cartModalIsOpen}
              onClose={() => setCartModalIsOpen(false)}
            />
          )}

          {user && (
            <div className="icon-container">
              <Link to="/user-profile">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
