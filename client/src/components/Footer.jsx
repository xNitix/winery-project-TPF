import "./styles/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2023 KKK. All rights reserved.</p>
      <FontAwesomeIcon icon={faPhone} className="phone-icon" />
      <span>+02 3 5 7 11 13 </span>
    </footer>
  );
};

export default Footer;
