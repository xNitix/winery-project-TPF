import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import "./ManagerPage.css";
import AuthContext from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";

const ManagerPage = () => {
  const { authTokens } = useContext(AuthContext);
  const { products, getProducts } = useContext(ProductContext);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const wine_id = searchParams.get("wineid");

  const [wineList, setWineList] = useState([]);
  const [wineForm, setWineForm] = useState({
    name: "Wino pomidorowe",
    description:
      "Doskonałe wino do dań z pomidorów, makaronów, pizzy, a także do dań z ryb i owoców morza.",
    image_url:
      "https://www.wine-express.pl/image/cache/catalog/Hiszpania/Luis%20Canas/joven-red-2016-rioja-luis-canas-hiszpania-96-767x1100.jpg",
    price: 69420.0,
    units_in_stock: 421,
    color_id: 1,
    country_id: "ES",
    year: 1410,
    taste_id: 1,
    volume: 750,
    alcohol: 13.0,
  });

  useEffect(() => {
    if (wine_id) {
      const wineToEdit = products.find(
        (wine) => wine.id === parseInt(wine_id, 10)
      );
      if (wineToEdit) {
        setWineForm(wineToEdit);
      }
    }
  }, [wine_id, products]);

  const handleInputChange = (e) => {
    const updatedWine = { ...wineForm, [e.target.name]: e.target.value };
    setWineForm(updatedWine);
  };

  const addWine = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/wines/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify(wineForm),
      });

      if (response.ok) {
        const data = await response.json();
        setWineList([...wineList, data]);
        getProducts();
        setWineForm({
          name: "",
          description: "",
          image_url: "",
          price: "",
          units_in_stock: "",
          color_id: "",
          country_id: "",
          year: "",
          taste_id: "",
          volume: "",
          alcohol: "",
        });
      } else {
        console.error("Failed to post wine:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while posting wine:", error);
    }
  };

  const updateWine = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/wines/${wineForm.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(wineForm),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWineList([...wineList.filter((item) => item.id !== data.id), data]);
        getProducts();
      } else {
        console.error("Failed to update wine:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while updating wine:", error);
    }
  };

  return (
    <div>
      <h2>
        {wineForm.id ? "Admin Panel - Edit Wine" : "Admin Panel - Add Wine"}
      </h2>
      <form className="wineForm" onSubmit={wineForm.id ? updateWine : addWine}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={wineForm.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={wineForm.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          type="text"
          name="image_url"
          value={wineForm.image_url}
          onChange={handleInputChange}
          placeholder="Image URL"
          required
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          value={wineForm.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />

        <label htmlFor="units_in_stock">Units in Stock</label>
        <input
          type="number"
          name="units_in_stock"
          value={wineForm.units_in_stock}
          onChange={handleInputChange}
          placeholder="Units in Stock"
          required
        />

        <label htmlFor="color">Color_id</label>
        <input
          type="number"
          name="color_id"
          value={wineForm.color_id}
          onChange={handleInputChange}
          placeholder="Color_id"
          required
        />

        <label htmlFor="country">Country_id</label>
        <input
          type="text"
          name="country_id"
          value={wineForm.country_id}
          onChange={handleInputChange}
          placeholder="Country_id"
          required
        />

        <label htmlFor="year">Year</label>
        <input
          type="number"
          name="year"
          value={wineForm.year}
          onChange={handleInputChange}
          placeholder="Year"
          required
        />

        <label htmlFor="taste">Taste_id</label>
        <input
          type="number"
          name="taste_id"
          value={wineForm.taste_id}
          onChange={handleInputChange}
          placeholder="Taste_id"
          required
        />

        <label htmlFor="volume">Volume</label>
        <input
          type="number"
          name="volume"
          value={wineForm.volume}
          onChange={handleInputChange}
          placeholder="Volume"
          required
        />

        <label htmlFor="alcohol">Alcohol Content</label>
        <input
          type="number"
          name="alcohol"
          value={wineForm.alcohol}
          onChange={handleInputChange}
          placeholder="Alcohol Content"
          required
        />

        <button type="submit" className="admin-button">
          {wineForm.id ? "Update Wine" : "Add Wine"}
        </button>
      </form>
    </div>
  );
};

export default ManagerPage;
