import { useEffect } from "react";
import "./SavedProperties.css";
import { useDispatch, useSelector } from "react-redux";
import { getSavedProperties, unsaveProperty } from "../../redux/slices/propertiesSlice";
import { useNavigate } from "react-router-dom";
import { propertyTypeIcons, WishlistIcon } from "../../Components/Property/propertyTypeIcons";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

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

const SavedProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedProperties } = useSelector((state) => state.properties);
  console.log("savedProperties", savedProperties);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(getSavedProperties());
    }
  }, [user, dispatch]);

  return (
    <div className="saved-properties-page">
      <div className="saved-properties-header-row">
        <h2 className="saved-properties-title">Saved Properties</h2>
        <button className="saved-properties-back-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div className="saved-properties-count">
        {savedProperties && savedProperties.length > 0 ? `${savedProperties.length} Saved Propert${savedProperties.length === 1 ? 'y' : 'ies'}` : 'No saved properties yet.'}
      </div>
      {savedProperties && savedProperties.length > 0 ? (
        <div className="saved-properties-grid">
          {savedProperties.map((property, idx) => {
            let detectedType = PROPERTY_TYPES.find(type =>
              property.type?.toLowerCase() === type.toLowerCase() ||
              property.title?.toLowerCase().includes(type.toLowerCase())
            ) || "Apartment";
            const TypeIcon = propertyTypeIcons[detectedType] || propertyTypeIcons["Apartment"];
            return (
              <div
                key={property.id || idx}
                className="saved-properties-card"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="saved-properties-image-wrapper">
                  <img src={property.image} alt={property.title} />
                  <div className="saved-properties-type-badge">
                    <TypeIcon style={{ marginRight: 4 }} />
                    {detectedType}
                  </div>
                </div>
                <div className="saved-properties-info">
                  <div className="saved-properties-wishlist-row">
                    <h3>{property.title}</h3>
                    <button
                      className="saved-properties-wishlist-btn active"
                      title="Remove from wishlist"
                      onClick={e => {
                        e.stopPropagation();
                        dispatch(unsaveProperty(property.id));
                      }}
                    >
                      <WishlistIcon />
                    </button>
                  </div>
                  <div className="saved-properties-location"><FaMapMarkerAlt /> {property.location}</div>
                  <div className="saved-properties-details">
                    <span title="Bedrooms"><FaBed /> {property.bedrooms}</span>
                    {" | "}
                    <span title="Bathrooms"><FaBath /> {property.bathrooms}</span>
                    {" | "}
                    <span title="Size"><FaRulerCombined /> {property.size_sqft} sqft</span>
                  </div>
                  <div className="saved-properties-price">Price: <span className="saved-properties-priceval">${property.price}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default SavedProperties;
