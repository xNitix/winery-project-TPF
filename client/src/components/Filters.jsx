import { useState, useEffect } from "react";
import SingleFilter from "./SingleFilter";
import FilterSort from "./FilterSort";
import FilterRating from "./FilterRating";

const fetchFilterOptions = async (url, onDataFetched) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      onDataFetched(data);
    } else {
      console.error(`Failed to fetch data from ${url}`);
    }
  } catch (error) {
    console.error(`Error while fetching data from ${url}:`, error);
  }
};

const Filters = ({
  filters,
  onFilterChange,
  onSortChange,
  sortingOption,
  onRatingChange,
}) => {
  const [countries, setCountries] = useState([]);
  const [tastes, setTastes] = useState([]);
  const [alcohols, setAlcohols] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [vintages, setVintages] = useState([]);

  const handleCountriesFetched = (data) => {
    const countryNames = data.map((country) => country.name);
    setCountries(countryNames);
  };

  useEffect(() => {
    fetchFilterOptions(
      "http://127.0.0.1:8000/api/countries",
      handleCountriesFetched
    );
  }, []);

  const handleTastesFetched = (data) => {
    const tasteNames = data.map((taste) => taste.taste);
    setTastes(tasteNames);
  };

  useEffect(() => {
    fetchFilterOptions(
      "http://127.0.0.1:8000/api/wine_tastes",
      handleTastesFetched
    );
  }, []);

  const handleAlcoholsFetched = (data) => {
    data.sort((a, b) => a - b);
    setAlcohols(data);
  };

  useEffect(() => {
    fetchFilterOptions(
      "http://127.0.0.1:8000/api/wine_alcohol_values",
      handleAlcoholsFetched
    );
  }, []);

  const handleVolumesFetched = (data) => {
    data.sort((a, b) => a - b);
    setVolumes(data);
  };

  useEffect(() => {
    fetchFilterOptions(
      "http://127.0.0.1:8000/api/wine_volume_values",
      handleVolumesFetched
    );
  }, []);

  const handleVintagesFetched = (data) => {
    data.sort((a, b) => a - b);
    setVintages(data);
  };

  useEffect(() => {
    fetchFilterOptions(
      "http://127.0.0.1:8000/api/wine_year_values",
      handleVintagesFetched
    );
  }, []);

  const SortingOptions = [
    "Price: Lowest first",
    "Price: Highest first",
    "Highest rated",
  ];

  return (
    <div className="filters-container">
      <FilterSort
        sortingOptions={SortingOptions}
        selectedOption={sortingOption}
        onSortChange={onSortChange}
      />
      <FilterRating onRatingChange={onRatingChange} />
      <SingleFilter
        filter={"country"}
        filterName={"Countries"}
        options={countries}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <SingleFilter
        filter={"taste"}
        filterName={"Tastes"}
        options={tastes}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <SingleFilter
        filter={"alcohol"}
        filterName={"Alcohol"}
        options={alcohols}
        filters={filters}
        onFilterChange={onFilterChange}
        optionalValue={"%"}
      />
      <SingleFilter
        filter={"volume"}
        filterName={"Volume"}
        options={volumes}
        filters={filters}
        onFilterChange={onFilterChange}
        optionalValue={"ml"}
      />
      <SingleFilter
        filter={"vintage"}
        filterName={"Vintage"}
        options={vintages}
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default Filters;
