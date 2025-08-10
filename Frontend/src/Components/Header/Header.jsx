import './Header.css';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSuggestionProperties, chatbotProperties } from '../../redux/slices/propertiesSlice';
import Properties from '../Property/properties.jsx';

const PROPERTY_PRICES = [250000, 380000, 450000, 300000, 600000, 700000, 750000, 850000, 920000, 1200000];
const PROPERTY_LOCATIONS = [
  "New York, NY", "Miami, FL", "Los Angeles, CA", "Austin, TX", "San Francisco, CA",
  "Chicago, IL", "Dallas, TX", "Seattle, WA", "Boston, MA"
];
const PROPERTY_BEDROOMS = [1, 2, 3, 4, 5];
const PROPERTY_BATHROOMS = [1, 2, 3, 4];

const BOT_AVATAR = (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#408de4"/>
    <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Arial" dy=".3em">🤖</text>
  </svg>
);
const USER_AVATAR = (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#1A3C34"/>
    <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Arial" dy=".3em">🧑</text>
  </svg>
);

const AMENITIES = [
  "Gym", "Swimming Pool", "Parking", "Beach Access", "Security", "Balcony", "Private Garden", "Smart Home", "Garage", "Laundry", "Rooftop Terrace", "Smart Security", "Private Elevator"
];

const PREDEFINED = [
  "Show me properties under $500,000",
  "I want a 3-bedrooms apartment in New York",
  "Find Apartment with a swimming pool",
  "Show me villas with a private garden"
];

const initialBotMsg = {
  sender: "bot",
  text: "👋 Hi! I'm your real estate assistant. Tell me about your dream home—your budget, preferred location, number of bedrooms/bathrooms, and any must-have amenities. Or use filters to get started!"
};

const Header = ({ onApplyFilters, scrollToPropertiesSection, setPropertiesHeading, ...props }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chat, setChat] = useState([initialBotMsg]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chatbotReply = useSelector(state => state.properties.chatbotMessage);
  const chatbotProps = useSelector(state => state.properties.chatbotProperties);
  const suggestionProperties = useSelector(state => state.properties.properties);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    locations: [],
    minPrice: Math.min(...PROPERTY_PRICES),
    maxPrice: Math.max(...PROPERTY_PRICES),
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: [],
    showLocationDropdown: false
  });
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chat]);

  const dispatch = useDispatch();

  const cleanHeading = (str) => {
    return str.replace(/^(Show me|I want a|Find|Show me)\s*/i, '').trim();
  };

  const handleSend = async (msg) => {
    if (!msg.trim()) return;
    setChat(prev => [
      ...prev,
      { sender: "user", text: msg }
    ]);
    setSearchTerm("");
    if (setPropertiesHeading && chatbotProps.length>0) setPropertiesHeading(`Results for: ${cleanHeading(msg)}`);
    dispatch(chatbotProperties(msg));
  };

  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const handleSuggestion = (suggestion) => {
    setChat(prev => [
      ...prev,
      { sender: "user", text: suggestion }
    ]);
    setActiveSuggestion(suggestion);
    if (setPropertiesHeading) setPropertiesHeading(cleanHeading(suggestion));
    dispatch(getSuggestionProperties(suggestion));
  };

  useEffect(() => {
    if (activeSuggestion !== null && Array.isArray(suggestionProperties)) {
      setChat(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Here are some properties matching your suggestion.`,
          properties: suggestionProperties,
          showViewProperties: suggestionProperties.length > 0
        }
      ]);
      setActiveSuggestion(null);
    }
  }, [suggestionProperties, activeSuggestion]);

  useEffect(() => {
    if (chatbotReply !== null && Array.isArray(chatbotProps)) {
      if (chatbotProps.length > 0) {
        setChat(prev => [
          ...prev,
          {
            sender: 'bot',
            text: chatbotReply || 'Here are some properties matching your query.',
            properties: chatbotProps,
            showViewProperties: true
          }
        ]);
      } else {
        setChat(prev => [
          ...prev,
          {
            sender: 'bot',
            text: chatbotReply,
            properties: [],
            showViewProperties: false
          }
        ]);
      }
    }
  }, [chatbotReply, chatbotProps]);

  const handleApplyFilters = () => {
    setShowFilter(false);
    const params = {
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      minSize: filters.size,
      locations: filters.locations,
      amenities: filters.amenities,
    };
    if (filters.locations.length > 0) {
      params.location = filters.locations.join(",");
    }
    delete params.locations;
    if (!filters.size) delete params.minSize;
    if (!filters.bedrooms) delete params.bedrooms;
    if (!filters.bathrooms) delete params.bathrooms;
    if (!filters.amenities.length) delete params.amenities;
    onApplyFilters(params);
    const summary = [
      filters.maxPrice && `Budget: ≤ ₹${filters.maxPrice}`,
      filters.locations.length > 0 && `Location: ${filters.locations.join(", ")}`,
      filters.bedrooms && `Bedrooms: ${filters.bedrooms}`,
      filters.bathrooms && `Bathrooms: ${filters.bathrooms}`,
      filters.amenities.length > 0 && `Amenities: ${filters.amenities.join(", ")}`,
    ].filter(Boolean).join("\n- ");
    setChat((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `Filters applied:\n- ${summary}`,
      },
    ]);
  };

  const handleAmenityChange = (amenity) => {
    setFilters(f => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter(a => a !== amenity)
        : [...f.amenities, amenity]
    }));
  };

  const handlePopupBgClick = (e) => {
    if (e.target.classList.contains('chatbot-filter-popup')) {
      setShowFilter(false);
    }
  };

  return (
  <div className={`header${isFullscreen ? ' chatbot-fullscreen' : ''}`}> 

      {/* Fullscreen close button (when fullscreen) */}
      {isFullscreen && (
        <button
          className="chatbot-close-btn chatbot-close-btn-fullscreen"
          onClick={() => setIsFullscreen(false)}
          title="Close Fullscreen"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="#408de4" strokeWidth="2"/><path d="M7 7l8 8M15 7l-8 8" stroke="#408de4" strokeWidth="1.5"/></svg>
        </button>
      )}

      <div className={`header-main-content${isFullscreen ? ' header-main-content-fullscreen' : ''}`}> 
        <div
          className={isFullscreen ? 'fullscreen-chatbox-left' : ''}
        >
            <div className="chatbot-heading-section chatbot-heading-section-fullscreen">
              <h1 className="chatbot-main-heading">PropBot: Your Real Estate Home Finder</h1>
              <p className="chatbot-desc">Welcome to PropBot! Your smart home-hunting assistant. Just chat your budget, location & needs — and get personalized property suggestions. Use filters for even better results!</p>
            </div>
          <div className={`chatbot-chatbox${isFullscreen ? ' chatbot-chatbox-fullscreen' : ''}`}> 
            {!isFullscreen && (
              <div className="chatbot-fullscreen-btn-row">
                <button
                  className="chatbot-fullscreen-btn"
                  onClick={() => setIsFullscreen(true)}
                  title="Expand Chatbot"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="4" stroke="#408de4" strokeWidth="2"/><path d="M7 7h2v2M15 7h-2v2M7 15h2v-2M15 15h-2v-2" stroke="#408de4" strokeWidth="1.5"/></svg>
                </button>
              </div>
            )}
            <div className="chatbot-messages" ref={messagesEndRef}>
              {chat.map((msg, idx) => (
                msg.sender === 'bot' ? (
                  <div key={idx} className="chatbot-message bot">
                    <div className="chatbot-avatar-bubble">{BOT_AVATAR}</div>
                    <div className="chatbot-bubble bot-bubble">
                      {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                      {msg.showViewProperties && (
                        <button
                          className="view-properties-btn"
                          onClick={() => scrollToPropertiesSection && scrollToPropertiesSection()}
                          style={{marginTop:'10px',background:'#408de4',color:'#fff',border:'none',borderRadius:'16px',padding:'7px 22px',fontWeight:700,boxShadow:'0 2px 8px 0 rgba(64,141,228,0.10)',fontSize:'1rem',cursor:'pointer',transition:'background 0.2s'}}
                        >
                          View Properties
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="chatbot-message user">
                    <div className="chatbot-bubble user-bubble">
                      {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                    <div className="chatbot-avatar-bubble">{USER_AVATAR}</div>
                  </div>
                )
              ))}
            </div>
            <div className="chatbot-predefined">
              {PREDEFINED.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="chatbot-search-bar">
              <div className="chatbot-avatar">{BOT_AVATAR}</div>
              <input
                type="text"
                placeholder="Type your message..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend(searchTerm)}
              />
              <button className="send-btn" onClick={() => handleSend(searchTerm)}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M2 11L20 2L11 20L10 13L2 11Z" fill="white"/>
                </svg>
              </button>
              <button className="filter-btn" onClick={() => setShowFilter(true)}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 6h16M6 11h10M9 16h4" stroke="#408de4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isFullscreen && (
          <div
            className="fullscreen-property-cards-right"
          >
            <div className="fullscreen-property-cards-grid">
              <Properties 
                properties={chatbotProps && chatbotProps.length ? chatbotProps : suggestionProperties} 
                cardClassName="fullscreen-property-card-small"
              />
            </div>
          </div>
        )}
      </div>
      {showFilter && (
        <div className="chatbot-filter-popup" onClick={handlePopupBgClick}>
          <div className="chatbot-filter-content" style={{boxShadow:'0 8px 40px 0 rgba(64,141,228,0.22)', border:'2px solid #408de4', position:'relative'}}>
            <h3 style={{textAlign:'center', marginBottom:16, color:'#408de4'}}>Filter Properties</h3>
            <div className="chatbot-filter-fields">
              <label>
                Locations:
                <div className="filter-location-dropdown">
                  <button type="button" className="dropdown-btn" onClick={e => {
                    e.preventDefault();
                    setFilters(f => ({...f, showLocationDropdown: !f.showLocationDropdown}));
                  }}>
                    {filters.locations.length > 0 ? `${filters.locations.length} selected` : 'Select locations'}
                    <span style={{marginLeft:8,fontSize:12}}>&#9662;</span>
                  </button>
                  {filters.showLocationDropdown && (
                    <div className="dropdown-list">
                      {PROPERTY_LOCATIONS.map(loc => (
                        <label key={loc} className="dropdown-list-item">
                          <input
                            type="checkbox"
                            checked={filters.locations.includes(loc)}
                            onChange={e => {
                              setFilters(f => ({
                                ...f,
                                locations: e.target.checked
                                  ? [...f.locations, loc]
                                  : f.locations.filter(l => l !== loc)
                              }));
                            }}
                          />
                          {loc}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label>
                Size (sqft):
                <input type="number" value={filters.size} onChange={e => setFilters(f => ({...f, size: e.target.value}))} />
              </label>
              <label>
                Min Price:
                <input
                  type="number"
                  min={Math.min(...PROPERTY_PRICES)}
                  max={filters.maxPrice}
                  value={filters.minPrice}
                  onChange={e => setFilters(f => ({...f, minPrice: Number(e.target.value)}))}
                  style={{width: '110px'}}
                />
              </label>
              <label>
                Max Price:
                <input
                  type="number"
                  min={filters.minPrice}
                  max={Math.max(...PROPERTY_PRICES)}
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({...f, maxPrice: Number(e.target.value)}))}
                  style={{width: '110px'}}
                />
              </label>
              <label>
                Bedrooms:
                <select value={filters.bedrooms} onChange={e => setFilters(f => ({...f, bedrooms: e.target.value}))}>
                  <option value="">Any</option>
                  {PROPERTY_BEDROOMS.map(b => (
                    <option key={b} value={b}>{b}+</option>
                  ))}
                </select>
              </label>
              <label>
                Bathrooms:
                <select value={filters.bathrooms} onChange={e => setFilters(f => ({...f, bathrooms: e.target.value}))}>
                  <option value="">Any</option>
                  {PROPERTY_BATHROOMS.map(b => (
                    <option key={b} value={b}>{b}+</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="amenities-list">
              <span style={{width:'100%', fontWeight:600, color:'#408de4'}}>Amenities:</span>
              {AMENITIES.map(a => (
                <label key={a}>
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
            <div className="filter-actions">
              <button onClick={handleApplyFilters} style={{fontWeight:600}}>Apply</button>
              <button onClick={() => setShowFilter(false)} className="cancel" style={{fontWeight:600}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;