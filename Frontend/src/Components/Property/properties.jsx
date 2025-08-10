import "./properties.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveProperty, unsaveProperty, getSavedProperties } from "../../redux/slices/propertiesSlice";
import { useNavigate } from 'react-router-dom';
import CardLoader from "../Loader/CardLoader";
import { propertyTypeIcons, WishlistIcon } from "./propertyTypeIcons";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { useRef } from "react";
const PROPERTY_TYPES = [
  "Condo",
  "Villa",
  "Apartment",
  "Penthouse",
  "Studio",
  "House",
  "Townhouse",
  "Duplex",
  "Smart Home"
];
const CARDS_PER_ROW = 3;
const ROWS = 3;
const CARDS_PER_PAGE = CARDS_PER_ROW * ROWS;

const Properties = ({ properties, heading = "Explore Properties", scrollToOnChange = false, cardClassName = "" }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);
  const dispatch = useDispatch();
  const { savedProperties } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(getSavedProperties());
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (scrollToOnChange && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line
  }, [properties]);
  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };
  const totalPages = Math.ceil((properties?.length || 0) / CARDS_PER_PAGE);
  const startIdx = (currentPage - 1) * CARDS_PER_PAGE;
  const endIdx = startIdx + CARDS_PER_PAGE;
  const currentProperties = Array.isArray(properties) ? properties.slice(startIdx, endIdx) : [];
  return (
    <section className="homeproperties-section" ref={sectionRef}>
      <div className="homeproperties-header">
        <h2 className="homeproperties-title">{heading}</h2>
      </div>
      {Array.isArray(properties) && properties.length === 0 ? (
        <CardLoader count={4} />
      ) : (
        <>
          <div className="homeproperties-grid properties-results-grid">
            {currentProperties.map((property, idx) => {
              let detectedType = PROPERTY_TYPES.find(type =>
                property.type?.toLowerCase() === type.toLowerCase() ||
                property.title?.toLowerCase().includes(type.toLowerCase())
              ) || "Apartment";
              const TypeIcon = propertyTypeIcons[detectedType] || propertyTypeIcons["Apartment"];
              return (
                <div
                  key={property.id || idx}
                  className={`homeproperties-card property-result-card ${cardClassName}`}
                  onClick={() => handleCardClick(property.id)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <div className={`homeproperties-image-wrapper${cardClassName ? ' property-image-small' : ''}`}>
                    <img src={property.image} alt={property.title} />
                    <div className="property-type-badge">
                      <TypeIcon style={{ marginRight: 4 }} />
                      {detectedType}
                    </div>
                  </div>
                  <div className="homeproperties-info">
                    <div className="wishlist-row">
                      <h3>{property.title}</h3>
                      <button
                        className={`wishlist-btn${user && savedProperties && savedProperties.find(item => item.id == property.id) ? " active" : ""}`}
                        title={user && savedProperties && savedProperties.find(item => item.id == property.id) ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={e => {
                          e.stopPropagation();
                          if (!user) return alert("Please login to save properties");
                          if (savedProperties && savedProperties.find(item => item.id == property.id)) {
                            dispatch(unsaveProperty(property.id));
                          } else {
                            dispatch(saveProperty(property.id));
                          }
                        }}
                      >
                        <WishlistIcon />
                      </button>
                    </div>
                    <div className="homeproperties-location"><FaMapMarkerAlt /> {property.location}</div>
                    <div className="homeproperties-details">
                      <span title="Bedrooms"><FaBed /> {property.bedrooms}</span>
                      {" | "}
                      <span title="Bathrooms"><FaBath /> {property.bathrooms}</span>
                      {" | "}
                      <span title="Size"><FaRulerCombined /> {property.size_sqft} sqft</span>
                    </div>
                    <div className="homeproperties-price">Price: <span className="homeproperties-priceval">${property.price}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="properties-pagination">
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
        </>
      )}
    </section>
  );
};
export default Properties;