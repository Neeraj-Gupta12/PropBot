import PropTypes from "prop-types";
import { useState } from "react";
// Property/real estate themed images
const propertyImg = "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80";
const chatImg = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80";
const filterImg = "https://images.unsplash.com/photo-1503389152951-9c3d8b6b6d63?auto=format&fit=crop&w=800&q=80";
const aboutImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
import "./About.css";

const StoryItem = ({ item, index }) => {
  const { title, description, image } = item;
  return (
    <>
      <div className={`column ${index % 2 === 0 ? "reverse-order" : ""}`}>
        <div className={`story-text ${index % 2 === 0 ? "padding-left" : "padding-right"}`}>
          <h4 className="story-title">{title}</h4>
          <p className="story-description">{description}</p>
        </div>
      </div>
      <div className={`column ${index % 2 === 0 ? "" : "reverse-order"}`}>
        <div className="story-image-wrapper">
          <img src={image} alt={title} className="story-image" />
        </div>
      </div>
    </>
  );
};

StoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const About = () => {
  const [clickedDiv, setClickedDiv] = useState(null);

  const handleDivClick = (index) => {
    setClickedDiv(clickedDiv === index ? null : index);
  };

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About PropBot</h1>
        <hr />
      </div>
      <div className="about-content">
        <img className="about-image" src={aboutImg} alt="About PropBot" />
        <div className="about-text">
          <p style={{ color: "grey" }}>
            <b>PropBot</b> is your AI-powered real estate assistant. This smart chatbot helps you find the perfect property by understanding your needs through chat. Just tell PropBot your requirements—budget, location, number of bedrooms, amenities—and it will instantly show you the best matching properties.
          </p>
          <p style={{ color: "grey" }}>
            <b>How does it work?</b><br/>
            Simply chat with PropBot about what you want. You can also use the filter options to refine your search by price, location, size, and more. PropBot makes property search easy, interactive, and personalized for you.
          </p>
          <b className="mission-title">Why use PropBot?</b>
          <ul style={{ color: 'grey', marginTop: 8, marginBottom: 8 }}>
            <li>Find properties by chatting your needs—no forms, no hassle.</li>
            <li>Use filters for even more control over your search.</li>
            <li>Get instant, personalized property suggestions.</li>
            <li>See detailed property info, images, and amenities.</li>
          </ul>
        </div>
      </div>

      <div className="why-choose-us">
        <h2>Why PropBot?</h2>
      </div>
      <div className="why-content">
        {[
          {
            title: "Chatbot Search",
            image: chatImg,
            description:
              "Chat naturally with PropBot to get property suggestions tailored to your needs.",
          },
          {
            title: "Property Focused",
            image: propertyImg,
            description:
              "See only property-related results—no distractions, just homes that fit you.",
          },
          {
            title: "Smart Filters",
            image: filterImg,
            description:
              "Filter by price, location, size, and amenities for the most relevant results.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="why-item"
            onClick={() => handleDivClick(index)}
          >
            {clickedDiv === index ? (
              <p className="why-description">{item.description}</p>
            ) : (
              <>
                <img className="why-icon" src={item.image} alt={item.title} />
                <h3 className="why-title">{item.title}</h3>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
