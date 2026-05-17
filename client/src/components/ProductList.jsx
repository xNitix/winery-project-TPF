import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import ReactPaginate from "react-paginate";
import Filters from "./Filters";
import "./styles/ProductList.css";

const ProductList = ({ products }) => {
  const calculatePerPage = () => {
    const productsPerRow = Math.floor(window.innerWidth / 350);
    return productsPerRow * 5;
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(calculatePerPage());
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [sortingOption, setSortingOption] = useState("Price: Highest first");
  const [selectedRating, setSelectedRating] = useState(0);
  const [filters, setFilters] = useState({
    country: [],
    taste: [],
    alcohol: [],
    volume: [],
    vintage: [],
  });

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortChange = (option) => {
    setSortingOption(option);
  };

  useEffect(() => {
    applyFilters();
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setPerPage(calculatePerPage());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    scrollToTop();
  }, [currentPage, searchParams]);

  const offset = currentPage * perPage;

  const handleFilterChange = (filter, option) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (updatedFilters[filter].includes(option)) {
        updatedFilters[filter] = updatedFilters[filter].filter(
          (item) => item !== option
        );
      } else {
        updatedFilters[filter] = [...updatedFilters[filter], option];
      }

      return updatedFilters;
    });
  };

  const applyFilters = () => {
    let filteredData = products;

    filteredData = searchTerm
      ? filteredData.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : filteredData;

    filteredData = filteredData.filter((product) => {
      if (
        filters.country.length > 0 &&
        !filters.country.includes(product.country)
      ) {
        return false;
      }

      if (filters.taste.length > 0 && !filters.taste.includes(product.taste)) {
        return false;
      }

      if (
        filters.alcohol.length > 0 &&
        !filters.alcohol.includes(parseFloat(product.alcohol))
      ) {
        return false;
      }

      if (
        filters.volume.length > 0 &&
        !filters.volume.includes(product.volume)
      ) {
        return false;
      }

      if (
        filters.vintage.length > 0 &&
        !filters.vintage.includes(product.year)
      ) {
        return false;
      }

      return true;
    });

    filteredData = filteredData.filter(
      (product) => product.rating >= selectedRating
    );

    filteredData.sort((a, b) => {
      switch (sortingOption) {
        case "Price: Lowest first":
          return a.price - b.price;
        case "Price: Highest first":
          return b.price - a.price;
        case "Highest rated":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setCurrentPage(0);
    setFilteredProducts(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, sortingOption, selectedRating]);

  useEffect(() => {
    setCurrentPageData(filteredProducts.slice(offset, offset + perPage));
  }, [filteredProducts, offset, perPage]);

  return (
    <>
      <div className="product-list-container">
        <div className="filters-wrapper">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortingOption={sortingOption}
            onRatingChange={handleRatingChange}
          />
        </div>
        {filteredProducts.length == 0 ? (
          <div className="product-list">
            <img src="/src/assets/no-items-found.jpg" alt="No Items Found" />
          </div>
        ) : (
          <div className="product-list">
            {currentPageData.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length != 0 && (
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredProducts.length / perPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              forcePage={currentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
