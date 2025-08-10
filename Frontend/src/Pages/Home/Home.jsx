import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import Properties from "../../Components/Property/properties";
import { getAllProperties, filterProperties } from "../../redux/slices/propertiesSlice";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(() => {
    if (location.state && location.state.activeButton) {
      return location.state.activeButton;
    }
    return "search-all";
  });

  const dispatch = useDispatch();
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [filterHeading, setFilterHeading] = useState("Explore All Properties");
  const [propertiesHeading, setPropertiesHeading] = useState("Explore All Properties");
  const [scrollToProperties, setScrollToProperties] = useState(false);

  useEffect(() => {
    if (!appliedFilters) {
      dispatch(getAllProperties());
      setFilterHeading("Explore All Properties");
      setPropertiesHeading("Explore All Properties");
      setScrollToProperties(false);
    } else {
      dispatch(filterProperties(appliedFilters));
      let headingParts = [];
      if (appliedFilters.locations?.length > 0) {
        headingParts.push(`in ${appliedFilters.locations.join(", ")}`);
      }
      if (appliedFilters.bedrooms) {
        headingParts.push(`${appliedFilters.bedrooms}+ Bedrooms`);
      }
      if (appliedFilters.bathrooms) {
        headingParts.push(`${appliedFilters.bathrooms}+ Bathrooms`);
      }
      if (appliedFilters.maxPrice) {
        headingParts.push(`Under ₹${appliedFilters.maxPrice}`);
      }
      if (appliedFilters.amenities?.length > 0) {
        headingParts.push(`with ${appliedFilters.amenities.join(" & ")}`);
      }
      const heading = headingParts.length > 0 ? `Filters applied` : "Filters applied:";
      setFilterHeading(heading);
      setPropertiesHeading(heading);
      setScrollToProperties(true);
    }
    // eslint-disable-next-line
  }, [dispatch, appliedFilters]);


  const properties = useSelector((state) => {
    const stateProps = state.properties;
    if (appliedFilters && stateProps.properties && stateProps.properties.length > 0) {
      return stateProps.properties;
    }
    if (stateProps.chatbotProperties && stateProps.chatbotProperties.length > 0) {
      return stateProps.chatbotProperties;
    }
    if (stateProps.suggestionProperties && stateProps.suggestionProperties.length > 0) {
      return stateProps.suggestionProperties;
    }
    return stateProps.properties || [];
  });

  const handleApplyFilters = (filters) => {
    const clean = Object.fromEntries(Object.entries(filters).filter(([k, v]) => v && (Array.isArray(v) ? v.length > 0 : true)));
    if (Object.keys(clean).length > 0) {
      setAppliedFilters(clean);
      setScrollToProperties(true);
    } else {
      setAppliedFilters(null);
      setScrollToProperties(false);
    }
  };

  const propertiesSectionRef = useRef(null);

  const scrollToPropertiesSection = () => {
    if (propertiesSectionRef.current) {
      propertiesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <Header
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        onApplyFilters={handleApplyFilters}
        scrollToPropertiesSection={scrollToPropertiesSection}
        setPropertiesHeading={setPropertiesHeading}
      />
      <div className="home-section-container" ref={propertiesSectionRef}>
        <Properties properties={properties} heading={propertiesHeading} scrollToOnChange={scrollToProperties} />
      </div>
    </div>
  );
};

export default Home;