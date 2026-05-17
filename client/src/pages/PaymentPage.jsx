import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import "../pages/PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  let [profile, setProfile] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);
  const cartItems = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    zip_code: "",
    country: "",
    phone_number: "",
    email: "",
    order_details: cartItems.map((item) => ({
      wine_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
    })),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
        window.location.reload();
      } else {
        console.error("Failed to make payment:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setProfile(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-h2">Enter your payment information:</h2>
        <input
          className="payment-input"
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="zip_code"
          placeholder="Zip Code"
          value={formData.zip_code}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
        <input
          className="payment-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
