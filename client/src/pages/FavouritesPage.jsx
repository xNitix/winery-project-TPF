import React, { useContext } from "react";
import { FavContext } from "../context/FavContext";
import ProductList from "../components/ProductList";
import { ProductContext } from "../context/ProductContext";

const FavouritesPage = () => {
  const { products } = useContext(ProductContext);
  const { favIds } = useContext(FavContext);
  const favorites = products.filter((product) => favIds.includes(product.id));
  return <ProductList products={favorites} />;
};
export default FavouritesPage;
