import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaMapMarkerAlt, FaHotel, FaCamera } from "react-icons/fa";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  const [filters, setFilters] = useState({
    types: [],
    priceRange: [0, 10000],
    rating: 0,
    city: "",
  });

  const [selectedCities, setSelectedCities] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState(null);
  const [dateSortOption, setDateSortOption] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 779);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, attractions, trips, loading: searchLoading, error: searchError } = useSelector((state) => state.search);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 779);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const params = {};
    if (query) params.query = query;
    dispatch(universalSearch(params));
  }, [dispatch, query]);

  useEffect(() => {
    if (!searchLoading) {
      setIsLoading(false);
      prepareResults();
    }
  }, [hotels, attractions, trips, searchLoading]);

  const prepareResults = () => {
    let results = [];
    
    if (attractions?.length > 0) {
      results = attractions.map(attraction => ({
        ...attraction,
        type: 'attraction',
        displayName: attraction.name || 'Unnamed Attraction',
        displayImage: attraction.images?.[0] || attraction.image || 'default-image.jpg',
        displayPrice: attraction.entryFee || 0,
        displayRating: attraction.rating || 0,
        displayLocation: attraction.city || attraction.location || 'Unknown Location',
        displayDescription: attraction.description || 'No description available',
        createdAt: attraction.createdAt || new Date()
      }));
    }
    
    if (hotels?.length > 0) {
      const hotelResults = hotels.map(hotel => ({
        ...hotel,
        type: 'hotel',
        displayName: hotel.name || 'Unnamed Hotel',
        displayImage: hotel.images?.[0] || hotel.image || 'default-image.jpg',
        displayPrice: hotel.pricePerNight || 0,
        displayRating: hotel.rating || 0,
        displayLocation: hotel.city || hotel.location || 'Unknown Location',
        displayDescription: hotel.description || 'No description available',
        createdAt: hotel.createdAt || new Date()
      }));
      results = [...results, ...hotelResults];
    }

    if (trips?.length > 0) {
      const tripResults = trips.map(trip => ({
        ...trip,
        type: 'trip',
        displayName: trip.title || trip.name || 'Unnamed Trip',
        displayImage: trip.images?.[0] || trip.image || trip.thumbnail || 'default-image.jpg',
        displayPrice: trip.price || trip.cost || 0,
        displayRating: trip.rating || 0,
        displayLocation: trip.destination || trip.city || trip.location || 'Unknown Location',
        displayDescription: trip.description || trip.overview || 'No description available',
        createdAt: trip.createdAt || new Date()
      }));
      results = [...results, ...tripResults];
    }

    setAllResults(results);
    applyFilters(results);
    setCurrentPage(1);
  };

  const applyFilters = (resultsToFilter = allResults) => {
    let updatedResults = [...resultsToFilter];

    if (filters.types.length > 0) {
      updatedResults = updatedResults.filter(item => filters.types.includes(item.type));
    }

    updatedResults = updatedResults.filter(
      (item) =>
        item.displayPrice >= filters.priceRange[0] &&
        item.displayPrice <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      updatedResults = updatedResults.filter(
        (item) => item.displayRating >= filters.rating
      );
    }

    if (selectedCities.length > 0) {
      updatedResults = updatedResults.filter(item =>
        selectedCities.includes(item.displayLocation)
      );
    }

    if (priceSortOption === "priceLowToHigh") {
      updatedResults.sort((a, b) => a.displayPrice - b.displayPrice);
    } else if (priceSortOption === "priceHighToLow") {
      updatedResults.sort((a, b) => b.displayPrice - a.displayPrice);
    }

    if (dateSortOption === "newest") {
      updatedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateSortOption === "oldest") {
      updatedResults.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredResults(updatedResults);
  };

  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [filters, priceSortOption, dateSortOption, selectedCities, isLoading]);

  if (isLoading) {
    return <div className="search-loading">Loading...</div>;
  }

  if (searchError) {
    return <div className="search-error">Error: {searchError}</div>;
  }

  const resetFilters = () => {
    setFilters({
      types: [],
      priceRange: [0, 10000],
      rating: 0,
      city: "",
    });
    setSelectedCities([]);
    setPriceSortOption(null);
    setDateSortOption(null);
    setCurrentPage(1);
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const handlePriceRangeChange = (values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: values,
    }));
  };

  const handleCardClick = (item) => {
    const routes = {
      hotel: `/hotel/${item._id}`,
      attraction: `/attraction/${item._id}`,
      trip: `/trip/${item._id}`
    };
    navigate(routes[item.type] || '/');
  };

  const cities = [...new Set(allResults.map((item) => item.displayLocation))];

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const renderResultCard = (item) => (
    <div 
      key={item._id} 
      className="result-card" 
      onClick={() => handleCardClick(item)}
      style={{ cursor: "pointer" }}
    >
      <div className="result-image">
        <img src={item.displayImage} alt={item.displayName} />
        <div className="result-type-badge">
          {item.type === 'attraction' ? <FaCamera /> : item.type === 'hotel' ? <FaHotel /> : <FaMapMarkerAlt />}
          {item.type === 'attraction' ? 'Attraction' : item.type === 'hotel' ? 'Hotel' : 'Trip'}
        </div>
      </div>
      <div className="result-content">
        <h3>{item.displayName}</h3>
        <p className="result-location">
          <FaMapMarkerAlt /> {item.displayLocation}
        </p>
        <div className="result-rating">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              color={i < item.displayRating ? "#f4c150" : "#ddd"}
            />
          ))}
          <span>({item.displayRating})</span>
        </div>
        <p className="result-description">{item.displayDescription}</p>
        <div className="result-price">
          <span>₹{item.displayPrice}</span>
          {item.type === 'hotel' && <span>/night</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Search Results</h1>
        <p>
          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found for "{query}"
        </p>
      </div>
      <div className="top-bar">
        <button className="filter-button" onClick={toggleFilterPopup}>
          Filters & Sorting
        </button>
        <button className="reset-button" onClick={resetFilters}>
          Reset
        </button>
      </div>
      <div className="layout">
        <div className="search-sidebar">
          {isSmallScreen ? (
            <>
              <div className="filter-grid">
                <div className="type-section">
                  <h3>Type</h3>
                  <select
                    onChange={(e) => setFilters({ ...filters, types: e.target.value === "all" ? [] : [e.target.value] })}
                    value={filters.types[0] || "all"}
                  >
                    <option value="all">All</option>
                    <option value="attraction">Attractions</option>
                    <option value="hotel">Hotels</option>
                    <option value="trip">Trips</option>
                  </select>
                </div>
                <div className="rating-section">
                  <h3>Rating</h3>
                  <select
                    onChange={(e) =>
                      setFilters({ ...filters, rating: parseInt(e.target.value) })
                    }
                    value={filters.rating}
                  >
                    <option value="0">Any Rating</option>
                    <option value="1">1+ stars</option>
                    <option value="2">2+ stars</option>
                    <option value="3">3+ stars</option>
                    <option value="4">4+ stars</option>
                    <option value="5">5 stars</option>
                  </select>
                </div>
                <div className="city-section">
                  <h3>Cities</h3>
                  <div className="city-grid">
                    {cities.map((city, index) => (
                      <div key={index} className="city-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedCities([...selectedCities, city]);
                            } else {
                              setSelectedCities(selectedCities.filter(c => c !== city));
                            }
                          }}
                        />
                        <label>{city}</label>
                      </div>
                    ))}
                  </div>
                  <button
                    className="clear-cities-btn"
                    onClick={() => setSelectedCities([])}
                  >
                    Clear Cities
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="type-checkboxes">
                <h3>Type</h3>
                <div>
                  <input
                    type="checkbox"
                    checked={filters.types.includes("attraction")}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilters({ ...filters, types: [...filters.types, "attraction"] });
                      } else {
                        setFilters({ ...filters, types: filters.types.filter(t => t !== "attraction") });
                      }
                    }}
                  />
                  <label>Attractions</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={filters.types.includes("hotel")}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilters({ ...filters, types: [...filters.types, "hotel"] });
                      } else {
                        setFilters({ ...filters, types: filters.types.filter(t => t !== "hotel") });
                      }
                    }}
                  />
                  <label>Hotels</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={filters.types.includes("trip")}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilters({ ...filters, types: [...filters.types, "trip"] });
                      } else {
                        setFilters({ ...filters, types: filters.types.filter(t => t !== "trip") });
                      }
                    }}
                  />
                  <label>Trips</label>
                </div>
                <button
                  className="clear-types-btn"
                  onClick={() => setFilters({ ...filters, types: [] })}
                >
                  Clear Types
                </button>
              </div>
              <div className="rating-checkboxes">
                <h3>Rating</h3>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === star}
                      onChange={() => setFilters({ ...filters, rating: star })}
                    />
                    <label>
                      {Array.from({ length: star }, (_, i) => (
                        <FaStar key={i} color="#f4c150" />
                      ))}
                      & up
                    </label>
                  </div>
                ))}
              </div>
              <div className="city-checkboxes">
                <h3>Cities</h3>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCities([...selectedCities, city]);
                        } else {
                          setSelectedCities(selectedCities.filter(c => c !== city));
                        }
                      }}
                    />
                    <label>{city}</label>
                  </div>
                ))}
                <button
                  className="clear-cities-btn"
                  onClick={() => setSelectedCities([])}
                >
                  Clear Cities
                </button>
              </div>
            </>
          )}
        </div>
        <div className={filteredResults.length === 0 ? "center-no-results" : "results-grid-container"}>
          {filteredResults.length === 0 ? (
            <div className="no-results">
              <h2>No results found</h2>
              <p>Try searching with different keywords or browse all destinations.</p>
            </div>
          ) : (
            <div className="results-grid">
              {currentResults.map(renderResultCard)}
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && filteredResults.length > 0 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      {showFilterPopup && (
        <div className="filter-popup">
          <div className="filter-popup-content">
            <button className="close-popup" onClick={toggleFilterPopup}>
              Close
            </button>
            <h3>Price Range</h3>
            <div className="price-display">
              <span>
                Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </span>
            </div>
            <h3>Sort by Price</h3>
            <div>
              <input
                type="radio"
                name="priceSort"
                checked={priceSortOption === "priceLowToHigh"}
                onChange={() =>
                  setPriceSortOption(
                    priceSortOption === "priceLowToHigh"
                      ? null
                      : "priceLowToHigh"
                  )
                }
              />
              <label>Price Low to High</label>
            </div>
            <div>
              <input
                type="radio"
                name="priceSort"
                checked={priceSortOption === "priceHighToLow"}
                onChange={() =>
                  setPriceSortOption(
                    priceSortOption === "priceHighToLow"
                      ? null
                      : "priceHighToLow"
                  )
                }
              />
              <label>Price High to Low</label>
            </div>
            <h3>Sort by Date</h3>
            <div>
              <input
                type="radio"
                name="dateSort"
                checked={dateSortOption === "newest"}
                onChange={() =>
                  setDateSortOption(
                    dateSortOption === "newest" ? null : "newest"
                  )
                }
              />
              <label>Newest</label>
            </div>
            <div>
              <input
                type="radio"
                name="dateSort"
                checked={dateSortOption === "oldest"}
                onChange={() =>
                  setDateSortOption(
                    dateSortOption === "oldest" ? null : "oldest"
                  )
                }
              />
              <label>Oldest</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;