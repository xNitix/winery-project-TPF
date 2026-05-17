import "./styles/SingleFilter.css";

const SingleFilter = ({
  filter,
  filterName,
  options,
  filters,
  onFilterChange,
  optionalValue,
}) => {
  return (
    <>
      <div className="single-filter">
        <label>
          <div className="filter-header">
            <h2>{filterName}</h2>
            {optionalValue && (
              <p className="optionalValueText">{optionalValue}</p>
            )}
          </div>
        </label>
        <div className="options">
          {options.map((option, index) => (
            <div
              key={index}
              className={`option ${
                filters[filter].includes(option) ? "selected" : ""
              }`}
              onClick={() => onFilterChange(filter, option)}
            >
              <strong>{option}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SingleFilter;
