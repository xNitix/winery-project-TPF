import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext(null);

export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const updateProduct = async (id) => {
    let response = await fetch(`http://localhost:8000/api/wines/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setProducts(
        products.map((product) => {
          if (product.id === id) {
            return {
              name: data.name,
              type: data.taste.taste + "/" + data.color.color,
              taste: data.taste.taste,
              color: data.color.color,
              country: data.country.name,
              description: data.description,
              id: data.id,
              imageUrl: data.image_url,
              price: data.price,
              rating: data.rating,
              inStock: data.units_in_stock > 0,
              amount: data.units_in_stock,
              year: data.year,
              alcohol: data.alcohol,
              volume: data.volume,
            };
          }
          return product;
        })
      );
    } else {
      console.log("Error while updating product");
    }
  };

  const getProducts = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/wines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setProducts(
        data.map((wine) => {
          return {
            name: wine.name,
            type: wine.taste.taste + "/" + wine.color.color,
            taste: wine.taste.taste,
            color: wine.color.color,
            country: wine.country.name,
            description: wine.description,
            id: wine.id,
            imageUrl: wine.image_url,
            price: wine.price,
            rating: wine.rating,
            inStock: wine.units_in_stock > 0,
            amount: wine.units_in_stock,
            year: wine.year,
            alcohol: wine.alcohol,
            volume: wine.volume,
            taste_id: wine.taste.id,
            color_id: wine.color.id,
            country_id: wine.country.code,
          };
        })
      );
      setLoading(false);
    } else {
      console.log("Error");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProductContext.Provider value={{ products, updateProduct, getProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
