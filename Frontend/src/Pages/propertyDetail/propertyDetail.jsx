
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProperty } from "../../redux/slices/propertiesSlice";
import Loader from "../../Components/Loader/Loader";
import "./propertyDetail.css";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { getAmenityIcon } from "../../Components/Property/amenityIcons";

const PropertyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const property = useSelector((state) => state.properties.currentProperty);
  const loading = useSelector((state) => state.properties.loading);

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
            <div className="property-detail-header">{property.title}</div>
            <div className="property-detail-meta">
              <div className="property-detail-location">
                <FaMapMarkerAlt style={{ marginRight: 6, color: "#408de4" }} />
                {property.location}
              </div>
              <div className="property-detail-price">
                Price: <span style={{ fontWeight: 600 }}>${property.price}</span>
              </div>
            </div>
            <div className="property-detail-images">
              <img
                src={property.image}
                alt={property.title}
                className="property-detail-main-image"
              />
            </div>
            <div className="property-detail-info">
              <div className="property-detail-stats">
                <span title="Bedrooms"><FaBed style={{ marginRight: 4, color: '#4e4e4e' }} /> {property.bedrooms} Bedrooms</span>
                <span title="Bathrooms"><FaBath style={{ margin: '0 8px 0 16px', color: '#4e4e4e' }} /> {property.bathrooms} Bathrooms</span>
                <span title="Size"><FaRulerCombined style={{ margin: '0 8px 0 16px', color: '#4e4e4e' }} /> {property.size_sqft} sqft</span>
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