
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getProperty } from "../../redux/slices/propertiesSlice";
import Loader from "../../Components/Loader/Loader";
import "./propertyDetail.css";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { getAmenityIcon } from "../../Components/Property/amenityIcons";

import { addToCompare, removeFromCompare } from "../../redux/slices/compareSlice";

const PropertyDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const property = useSelector((state) => state.properties.currentProperty);
  const loading = useSelector((state) => state.properties.loading);
  const compareList = useSelector((state) => state.compare.compareList);
  const compareIds = compareList.map((p) => p.id);
  // Debug logs
  console.log('compareList:', compareList);
  console.log('compareIds:', compareIds);
  console.log('property:', property);

  // No button active by default on detail page
  const [activeButton, setActiveButton] = useState("");
  const navigate = useNavigate();

  // Custom setActiveButton: navigate to home and set section
  const handleSetActiveButton = (btn) => {
    navigate("/", { state: { activeButton: btn } });
  };

  useEffect(() => {
    dispatch(getProperty(id));
  }, [dispatch, id]);


  // Compare button logic
  const isCompared = property && compareIds.includes(property.id);
  const isCompareDisabled = !isCompared && compareList.length >= 3;
  console.log('isCompared:', isCompared, 'isCompareDisabled:', isCompareDisabled);

  const handleCompareClick = () => {
    if (isCompared) {
  dispatch(removeFromCompare(property.id));
    } else {
  dispatch(addToCompare(property));
    }
  };

  return (
    <div>
      <section className="property-detail-section">
        {loading && <Loader />}
        {!loading && !property && (
          <div className="property-not-found">
            <h2>Property not found</h2>
            <p>The property details could not be loaded. Please try again later.</p>
          </div>
        )}
        {!loading && property && (
          <>
            <div className="property-detail-header property-detail-header-flex">
              <span className="property-detail-title">{property.title}</span>
              <button
                className={`compare-btn${isCompared ? ' compared' : ''}`}
                onClick={handleCompareClick}
                disabled={isCompareDisabled}
              >
                {isCompared ? 'Remove from Compare' : isCompareDisabled ? 'Max 3 properties' : 'Add to Compare'}
              </button>
            </div>
            <div className="property-detail-meta">
              <div className="property-detail-location">
                <FaMapMarkerAlt className="property-detail-location-icon" />
                {property.location}
              </div>
              <div className="property-detail-price">
                Price: <span className="property-detail-priceval">${property.price}</span>
              </div>
            </div>
            {/* Compare button now in header */}
            <div className="property-detail-images">
              <img
                src={property.image}
                alt={property.title}
                className="property-detail-main-image"
              />
            </div>
            <div className="property-detail-info">
              <div className="property-detail-stats">
                <span title="Bedrooms"><FaBed className="property-detail-icon property-detail-bed" /> {property.bedrooms} Bedrooms</span>
                <span title="Bathrooms"><FaBath className="property-detail-icon property-detail-bath" /> {property.bathrooms} Bathrooms</span>
                <span title="Size"><FaRulerCombined className="property-detail-icon property-detail-size" /> {property.size_sqft} sqft</span>
              </div>
              {property.amenities && property.amenities.length > 0 && (
                <div className="property-detail-amenities">
                  <div className="amenities-title">Amenities</div>
                  <div className="amenities-list">
                    {property.amenities.map((amenity, idx) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div className="amenity-item" key={idx} title={amenity}>
                          <Icon className="amenity-icon" />
                          <span className="amenity-label">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default PropertyDetail;