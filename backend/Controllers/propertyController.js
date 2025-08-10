
import mongoose from "mongoose";
import User from "../Modals/userModal.js";
import property_basics from "../data/property_basics.json" with { type: "json" };
import property_characteristics from "../data/property_characteristics.json" with { type: "json" };
import property_images from "../data/property_images.json" with { type: "json" };
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import nlp from "compromise";


function mergePropertiesData() {
  const basics = property_basics;
  const characteristics = property_characteristics;
  const images = property_images;

  return basics.map((b) => {
    const char = characteristics.find((c) => c.id === b.id) || {};
    const img = images.find((i) => i.id === b.id) || {};
    return {
      ...b,
      ...char,
      image: img.image_url || null,
    };
  });
}

export const getAllProperties = catchAsyncError(async (req, res, next) => {
  const merged = mergePropertiesData();
  res.status(200).json({
    success: true,
    count: merged.length,
    properties: merged,
  });
});

export const getProperty = catchAsyncError(async (req, res, next) => {
  const merged = mergePropertiesData();
  const id = Number(req.params.id);
  const property = merged.find((item) => item.id === id);
  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }
  res.status(200).json({
    success: true,
    property,
  });
});

export const filteredProperties = catchAsyncError(async (req, res, next) => {
  const merged = mergePropertiesData();
  let results = merged;
  const {
    location,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minSize,
    maxSize,
    amenities,
    keyword
  } = req.query;
  if (location) {
  // Handle multiple locations (array or comma-separated string)
  let locationArr = [];
  if (Array.isArray(location)) {
    locationArr = location;
  } else if (typeof location === 'string') {
    locationArr = location.split(',').map(l => l.trim()).filter(Boolean);
  }
  
  if (locationArr.length > 0) {
    results = results.filter((p) => {
      if (!p.location) return false;
      
  // Normalize property location and search terms
      const propLoc = p.location.toLowerCase();
      
      return locationArr.some(searchLoc => {
        const normSearchLoc = searchLoc.toLowerCase();
        
  // Check for location match (exact or partial)
        return (
          propLoc === normSearchLoc ||
          propLoc.startsWith(normSearchLoc.split(',')[0]) ||
          normSearchLoc.startsWith(propLoc.split(',')[0])
        );
      });
    });
  } else {
  // Fallback: single location string
    const searchLoc = location.toLowerCase();
    results = results.filter((p) => 
      p.location && (
        p.location.toLowerCase() === searchLoc ||
        p.location.toLowerCase().startsWith(searchLoc.split(',')[0]) ||
        searchLoc.startsWith(p.location.toLowerCase().split(',')[0])
      )
    );
  }
}
  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }
  if (bedrooms) {
    results = results.filter((p) => p.bedrooms >= Number(bedrooms));
  }
  if (bathrooms) {
    results = results.filter((p) => p.bathrooms >= Number(bathrooms));
  }
  if (minSize) {
    results = results.filter((p) => p.size_sqft >= Number(minSize));
  }
  if (maxSize) {
    results = results.filter((p) => p.size_sqft <= Number(maxSize));
  }
  if (amenities) {
    const amenityArr = Array.isArray(amenities) ? amenities : amenities.split(",");
    results = results.filter((p) =>
      Array.isArray(p.amenities) && amenityArr.every((a) => p.amenities.includes(a))
  );
  }
  if (keyword) {
    results = results.filter((p) =>
      (p.title && p.title.toLowerCase().includes(keyword.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  res.status(200).json({
    success: true,
    count: results.length,
    properties: results,
  });
});

export const saveProperty = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { propertyId } = req.body;
  if (!propertyId) {
    return next(new ErrorHandler("Property ID is required", 400));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Save property as string (not ObjectId)
  if (user.savedProperties.map(id => id.toString()).includes(propertyId.toString())) {
    return res.status(200).json({ success: true, message: "Property already saved" });
  }
  user.savedProperties.push(propertyId.toString());
  await user.save();
  res.status(200).json({ success: true, message: "Property saved successfully" });
});

export const unsaveProperty = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { propertyId } = req.body;
  if (!propertyId) {
    return next(new ErrorHandler("Property ID is required", 400));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  user.savedProperties = user.savedProperties.filter(
    (id) => id.toString() !== propertyId.toString()
  );
  await user.save();
  res.status(200).json({ success: true, message: "Property unsaved successfully" });
});

export const getSavedProperties = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const merged = mergePropertiesData();
let savedIds = [];
  if (Array.isArray(user.savedProperties)) {
    savedIds = user.savedProperties.map(id => id.toString());
  } else if (typeof user.savedProperties === 'object' && user.savedProperties !== null) {
    savedIds = Object.values(user.savedProperties).map(id => id.toString());
  }
  const savedProperties = merged.filter(p => savedIds.includes(p.id.toString()));
  res.status(200).json({
    success: true,
    savedProperties,
  });
});

export const suggestionController = catchAsyncError(async (req, res, next) => {
  const { suggestion } = req.query;
  const PREDEFINED = [
    "Show me properties under $500,000",
    "I want a 3-bedrooms apartment in New York",
    "Find Apartment with a swimming pool",
    "Show me villas with a private garden"
  ];
  
  if (!PREDEFINED.includes(suggestion)) {
    return next(new ErrorHandler("Invalid suggestion. Only predefined suggestions are allowed.", 400));
  }
  
  const merged = mergePropertiesData();
  let filtered = merged;
  
  const s = suggestion.toLowerCase();

  // Handle: "Show me properties under $500,000"
  if (s === "show me properties under $500,000") {
    filtered = filtered.filter(p => p.price <= 500000);
  }

  // Handle: "I want a 3-bedrooms apartment in New York"
  else if (s === "i want a 3-bedrooms apartment in new york") {
    filtered = filtered.filter(p => {
      const location = (p.location || "").toLowerCase();
      return (
        Number(p.bedrooms) === 3 &&
        ((p.title && p.title.toLowerCase().includes("apartment")) || (p.type && p.type.toLowerCase() === "apartment")) &&
        (location.includes("new york") || location.includes("ny"))
      );
    });
  }
  
  // Handle: "Find Apartment with a swimming pool"
  else if (s === "find apartment with a swimming pool") {
    filtered = filtered.filter(p => 
      (p.title.toLowerCase().includes("apartment") || p.type?.toLowerCase() === "apartment") &&
      Array.isArray(p.amenities) && 
      p.amenities.some(a => a.toLowerCase().includes("swimming pool"))
    );
  }
  
  // Handle: "Show me villas with a private garden"
  else if (s === "show me villas with a private garden") {
    filtered = filtered.filter(p => 
      (p.title.toLowerCase().includes("villa") || p.type?.toLowerCase() === "villa") &&
      Array.isArray(p.amenities) && 
      p.amenities.some(a => a.toLowerCase().includes("private garden"))
    );
  }
  
  res.status(200).json({
    success: true,
    count: filtered.length,
    properties: filtered,
  });
});



// Property Chatbot Controller helpers
function filterPropertiesByMessage(message) {
  const allProperties = mergePropertiesData();
  const msg = message.toLowerCase();
  // Map of property types to variants
  const typeVariants = {
    apartment: ["apartment", "apartments", "appartment", "appartments", "allapartment", "allapartments", "apprtment", "aprtment", "aprtments"],
    villa: ["villa", "villas", "vila", "villas"],
    duplex: ["duplex", "duplexes", "duplx", "duplexx"],
    penthouse: ["penthouse", "penthouses", "penthouz", "penthouze"],
    studio: ["studio", "studios", "studi"],
    condo: ["condo", "condos", "kondo", "kondos"],
    house: ["house", "houses", "hous", "houz"],
    townhouse: ["townhouse", "townhouses", "town house", "town houses"],
    "smart home": ["smart home", "smarthome", "smart homes", "smarthomes"],
    // Add more as needed
  };
  // Detect property type in message
  let detectedType = null;
  for (const [type, variants] of Object.entries(typeVariants)) {
    if (variants.some(v => msg.includes(v))) {
      detectedType = type;
      break;
    }
  }
  if (detectedType) {
  // Return properties matching detected type
    return allProperties.filter(p => {
      const t = (p.type || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      // Strict: must match type or title (not partial match to avoid villa in apartment etc)
      return t === detectedType || title.includes(detectedType);
    });
  }
  // Fallback: broad keyword match
  const keywords = msg.split(/\s+/);
  return allProperties.filter(property => {
    return keywords.some(word =>
      Object.values(property).some(val =>
        typeof val === "string"
          ? val.toLowerCase().includes(word)
          : Array.isArray(val)
            ? val.some(item => item.toLowerCase().includes(word))
            : false
      )
    );
  });
}
// Create a short description for a property
function propertyShortDesc(property) {
  return `${property.title} in ${property.location} for $${property.price}`;
}
export const chatbotController = (req, res) => {
  const { message } = req.query;
  if (!message) {
    return res.status(400).json({ 
      message: "Please provide a property search query.", 
      properties: [] 
    });
  }

  const doc = nlp(message);
  const lowerMsg = message.toLowerCase().trim();

  // Greeting responses
  const greetingsMap = [
    { pattern: /^hi$/, response: "Hi! How can I help you with your property search today?" },
    { pattern: /^hello$/, response: "Hello! Welcome to PropBot. How can I assist you?" },
    { pattern: /^hey$/, response: "Hey there! Ready to find your dream home?" },
    { pattern: /^good morning$/, response: "Good morning! How can I help you start your property journey today?" },
    { pattern: /^good afternoon$/, response: "Good afternoon! Looking for a new place? I'm here to help." },
    { pattern: /^good evening$/, response: "Good evening! How can I assist you with properties tonight?" },
    { pattern: /^how are you\??$/, response: "Hello! I'm fine, thank you. How are you? Ready to explore some properties?" },
    { pattern: /^what's up\??$|^whats up\??$/, response: "All good here! How can I help you with your property needs?" },
    { pattern: /^yo$/, response: "Yo! Looking for a new home or investment?" },
    { pattern: /^yup$/, response: "Hey! How can I help you today?" },
    { pattern: /^namaste$/, response: "Namaste! How can I assist you in your property search?" },
    { pattern: /^salaam$/, response: "Salaam! How can I help you today?" },
    { pattern: /^good night$/, response: "Good night! If you need property info, I'm always here." },
    { pattern: /^hey there$/, response: "Hey there! How can I help you with properties?" },
    { pattern: /^hello there$/, response: "Hello there! How can I assist you?" },
    { pattern: /^howdy$/, response: "Howdy! Looking for a new place?" },
    { pattern: /^greetings$/, response: "Greetings! How can I help you today?" },
    { pattern: /^bonjour$/, response: "Bonjour! How can I help you with your property search?" },
    { pattern: /^hola$/, response: "Hola! How can I help you with your property search?" },
    { pattern: /^hey bot$/, response: "Hey! I'm PropBot, your property assistant. How can I help?" },
    { pattern: /^hello bot$/, response: "Hello! I'm PropBot, your property assistant. How can I help?" },
    { pattern: /^how are you doing\??$/, response: "I'm doing great, thank you! How can I help you today?" },
    { pattern: /^how is it going\??$/, response: "It's going well! How can I assist you with properties?" },
    { pattern: /^how's it going\??$/, response: "All good here! How can I help you with your property needs?" },
    { pattern: /^what's new\??$|^whats new\??$/, response: "I'm always learning new things about properties! How can I help you today?" },
    { pattern: /^yo bot$/, response: "Yo! I'm PropBot. Ready to help you find a home." },
    { pattern: /^hey propbot$/, response: "Hey! I'm PropBot. How can I help you today?" },
    { pattern: /^hello propbot$/, response: "Hello! I'm PropBot. How can I help you today?" },
    { pattern: /^hi propbot$/, response: "Hi! I'm PropBot. How can I help you today?" },
    { pattern: /^hey assistant$/, response: "Hey! I'm your property assistant. How can I help?" },
    { pattern: /^hello assistant$/, response: "Hello! I'm your property assistant. How can I help?" },
    { pattern: /^hi assistant$/, response: "Hi! I'm your property assistant. How can I help?" },
    { pattern: /^how are you propbot\??$/, response: "I'm great, thank you! How can I help you today?" },
    { pattern: /^how are you assistant\??$/, response: "I'm great, thank you! How can I help you today?" },
    { pattern: /^how are you doing propbot\??$/, response: "I'm doing well, thank you! How can I help you today?" },
    { pattern: /^how are you doing assistant\??$/, response: "I'm doing well, thank you! How can I help you today?" },
    { pattern: /^how are you today\??$/, response: "I'm good, thank you! How can I help you today?" },
    { pattern: /^how are you feeling\??$/, response: "I'm feeling great and ready to help you!" },
    { pattern: /^how's your day\??$/, response: "My day is going well! How can I help you?" },
    { pattern: /^how's your night\??$/, response: "My night is going well! How can I help you?" },
    { pattern: /^how's your morning\??$/, response: "My morning is going well! How can I help you?" },
    { pattern: /^how's your afternoon\??$/, response: "My afternoon is going well! How can I help you?" },
    { pattern: /^how's your evening\??$/, response: "My evening is going well! How can I help you?" },
  ];

  const greetingMatch = greetingsMap.find(g => g.pattern.test(lowerMsg.trim()));
  if (greetingMatch) {
    return res.json({ message: greetingMatch.response, properties: [] });
  }



  // Extract property IDs from message
  function extractPropertyIds(msg) {
  // Match patterns like 'id 1', 'id 1 and 3', 'id: 2, 5', 'ids 1,2,3'
    const idPattern = /id[s]?\s*[:]?\s*((\d+[ ,and]*)+)/i;
    const match = msg.match(idPattern);
    if (match && match[1]) {
  // Split by comma, 'and', or space
      return match[1]
        .split(/,|and|\s+/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter(n => !isNaN(n));
    }
    return [];
  }

  // Extract amenities from message
  function extractAmenities(msg) {
    // List of known amenities (expand as needed)
    const knownAmenities = [
      "gym", "swimming pool", "parking", "beach access", "security", "balcony", "private garden", "smart home", "garage", "laundry", "rooftop terrace", "smart security", "private elevator", "park view", "24/7 concierge", "fitness center", "private dock", "boat parking", "bbq area", "backyard", "community pool", "pet friendly", "home office", "solar panels", "two-car garage", "minimalist design", "smart appliances", "energy efficient"
    ];
    const found = [];
    for (const amenity of knownAmenities) {
  // Match as whole word or phrase, case-insensitive
      const regex = new RegExp(`\\b${amenity.replace(/[-/]/g, "[ -/]?")}\\b`, "i");
      if (regex.test(msg)) {
        found.push(amenity);
      }
    }
    return found;
  }

  // Extract bedrooms (ignores standalone numbers)
  function extractBedrooms(msg) {
  // Ignore if part of a price query
    if (/(?:price|cost|budget|\$|dollar|rs|inr|rupees|usd)\s+\d+/i.test(msg)) {
      return null;
    }
    
  // Match patterns like: "3 bedroom", "3br", "3 bhk", "3 beds"
    const bedroomMatch = msg.match(/(\d+)\s*(?:bed|bedroom|bedrooms|br|bhk|beds|bed\s*room|bed\s*rooms)/i);
    if (bedroomMatch) return Number(bedroomMatch[1]);
    
  // Match "of 3 bedrooms" only if not price context
    const ofBedroomMatch = msg.match(/of\s+(\d+)\s*(?:bed|bedroom|bedrooms)/i);
    if (ofBedroomMatch && !hasPriceContext(msg)) return Number(ofBedroomMatch[1]);
    
    return null;
  }

  // Check if message has price context
  function hasPriceContext(msg) {
    const priceKeywords = [
      'price', 'cost', 'budget', 'dollar', 'rupee', 'rs', 'inr', 'usd',
      'under', 'below', 'less than', 'upto', 'up to',
      'above', 'over', 'more than', 'from',
      '$', '₹', '€', '£'
    ];
    return new RegExp(`(?:^|\\s)(${priceKeywords.join('|')})(?:$|\\s)`, 'i').test(msg);
  }

  // Extract price (precise)
  function extractPrice(msg) {
    if (!hasPriceContext(msg)) return null;

  // Match patterns like: "$30000", "30000 dollars", "price 30000"
    const priceMatch = msg.match(/(?:\$|₹|€|£|dollar|rupee|rs|inr|usd|price|cost|budget)\s*(\d[\d,.]*)|(\d[\d,.]*)\s*(?:dollar|rupee|rs|inr|usd)/i);
    if (priceMatch) {
      const amount = priceMatch[1] || priceMatch[2];
      return parseFloat(amount.replace(/,/g, ''));
    }
    
  // Match "of 30000" only with price context
    const ofPriceMatch = msg.match(/of\s+(\d[\d,.]*)(?:\s*(?:dollar|rupee|rs|inr|usd))?/i);
    if (ofPriceMatch && hasPriceContext(msg)) {
      return parseFloat(ofPriceMatch[1].replace(/,/g, ''));
    }
    
    return null;
  }

  function extractPriceType(msg) {
    if (/(?:under|below|less than|upto|up to)/i.test(msg)) return "below";
    if (/(?:above|over|more than|from)/i.test(msg)) return "above";
    if (/(?:exactly|equal to|price of|at)/i.test(msg)) return "equal";
    // If $ or currency symbol is present with no range keyword, treat as exact
    if (/(?:\$|₹|€|£|dollar|rupee|rs|inr|usd)/i.test(msg)) {
      return "equal";
    }
    return null;
  }

  // Property filtering


  const location = doc.places().out('array')[0];
  const bedrooms = extractBedrooms(lowerMsg);
  const priceValue = extractPrice(lowerMsg);
  const priceType = extractPriceType(lowerMsg);
  const bathrooms = extractBathrooms(lowerMsg);
  const size = extractSize(lowerMsg);
  const detectedType = detectPropertyType(lowerMsg);
  const amenities = extractAmenities(lowerMsg);
  const propertyIds = extractPropertyIds(lowerMsg);

  // Check if the query is gibberish (no meaningful filters detected)
  const isGibberishQuery = !location && !bedrooms && !priceValue && !bathrooms && !size && !detectedType && amenities.length === 0 && propertyIds.length === 0;

  let merged = mergePropertiesData();
  let matchedProperties = [...merged];

  // Special case handling
  let botMessage = "";
  let name = null;
  if (lowerMsg.includes("my name is")) {
    const after = lowerMsg.split("my name is")[1];
    if (after) {
      name = after.trim().split(" ")[0];
    }
  } else {
    const people = doc.people().out('array');
    if (people.length > 0) {
      name = people[0];
    }
  }

  if (name) {
    botMessage = `Nice to meet you, ${name.charAt(0).toUpperCase() + name.slice(1)}! How can I assist you in finding your ideal property?`;
    return res.json({ message: botMessage, properties: [] });
  } else if (lowerMsg.includes("who are you") || lowerMsg.includes("what is your name")) {
    botMessage = "I am PropBot, your professional property assistant developed by agent Mira. I can help you find properties based on your preferences.";
  } else if (lowerMsg.includes("are you a bot") || lowerMsg.includes("are you real")) {
    botMessage = "Yes, I'm an AI-powered assistant here to help you with all your property needs!";
  } else if (lowerMsg.includes("who made you") || lowerMsg.includes("who created you")) {
    botMessage = "I was developed by agent Mira to help users like you find the perfect property.";
  } else if (lowerMsg.includes("thank you so much") || lowerMsg.includes("thanks a lot")) {
    botMessage = "You're very welcome! If you need more help, just ask.";
  } else if (lowerMsg.includes("thank you") || lowerMsg.includes("thanks")) {
    botMessage = "You're welcome! Let me know if you need anything else.";
  } else if (lowerMsg.includes("bye") || lowerMsg.includes("see you") || lowerMsg.includes("good night")) {
    botMessage = "Goodbye! Have a great day! If you need property info, I'm always here.";
  } else if (lowerMsg.includes("good morning")) {
    botMessage = "Good morning! How can I help you start your property journey today?";
  } else if (lowerMsg.includes("good afternoon")) {
    botMessage = "Good afternoon! Looking for a new place? I'm here to help.";
  } else if (lowerMsg.includes("good evening")) {
    botMessage = "Good evening! How can I assist you with properties tonight?";
  } else if (lowerMsg.includes("help") || lowerMsg.includes("what can you do") || lowerMsg.includes("how to use") || lowerMsg.includes("assist")) {
    botMessage = "You can ask me to find properties by location, price, amenities, or any feature you want! Try messages like 'Show me apartments in Dallas under $500,000' or 'Find villas with a swimming pool.'";
  }

  if (botMessage) {
    return res.json({ message: botMessage, properties: [] });
  }

  if (isGibberishQuery) {
    return res.json({
      message: "I couldn't understand your property search query. Please try something like:\n" +
               "- '3 bedroom apartments in New York'\n" +
               "- 'Houses under $500,000'\n" +
               "- 'Villas with swimming pool'",
      properties: []
    });
  }


  // Direct title match: if user's message matches a property title, return that property only
  const exactTitleMatch = merged.find(p => p.title && p.title.toLowerCase() === lowerMsg);
  let usedIdFilter = false;
  if (exactTitleMatch) {
    matchedProperties = [exactTitleMatch];
  } else if (typeof extractPropertyIds === 'function' && propertyIds && propertyIds.length > 0) {
    matchedProperties = merged.filter(p => propertyIds.includes(Number(p.id)));
    usedIdFilter = true;
  } else {
    // Apply filters in specific order
    if (detectedType) {
      matchedProperties = matchedProperties.filter(p => 
        p.type?.toLowerCase() === detectedType || 
        p.title?.toLowerCase().includes(detectedType)
      );
    }

    if (bedrooms) {
      matchedProperties = matchedProperties.filter(p => Number(p.bedrooms) === Number(bedrooms));
    }

    if (priceValue) {
      const priceFilterType = priceType || "equal"; // Default to exact match if no type specified
      if (priceFilterType === "below") {
        matchedProperties = matchedProperties.filter(p => p.price <= priceValue);
      } else if (priceFilterType === "above") {
        matchedProperties = matchedProperties.filter(p => p.price >= priceValue);
      } else {
        matchedProperties = matchedProperties.filter(p => p.price === priceValue);
      }
    }

    if (location) {
      matchedProperties = matchedProperties.filter(p => 
        p.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (bathrooms) {
      matchedProperties = matchedProperties.filter(p => Number(p.bathrooms) === Number(bathrooms));
    }

    if (size) {
      matchedProperties = matchedProperties.filter(p => Number(p.size_sqft) === Number(size));
    }

    // --- Amenities filter ---
    if (amenities.length > 0) {
      matchedProperties = matchedProperties.filter(p =>
        Array.isArray(p.amenities) && amenities.every(a =>
          p.amenities.some(pa => pa.toLowerCase() === a.toLowerCase())
        )
      );
    }
  }

  // Generate professional response
  if (/^\d+$/.test(message.trim())) {
    const number = parseInt(message.trim());
    if (number > 1000) {
      botMessage = `I see you mentioned ${number}. Could you please clarify:\n` +
                  `- Is this a price (e.g., $${number})?\n` +
                  `- Square footage?\n` +
                  `- Number of bedrooms?\n` +
                  `For better results, please include details like:\n` +
                  `- Property type (apartment, villa, etc.)\n` +
                  `- Location\n` +
                  `- Amenities you're looking for`;
      return res.json({ message: botMessage, properties: [] });
    }
  }

  // Handle simple bedroom queries
  if (bedrooms && !priceValue && !detectedType && !location) {
    if (matchedProperties.length === 0) {
      botMessage = `I couldn't find properties with ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}.\n` +
                   `Would you like to specify:\n` +
                   `- A location (e.g., "in New York")\n` +
                   `- A property type (e.g., "apartment" or "villa")\n` +
                   `- A price range (e.g., "under $500,000")`;
    } else {
      botMessage = `Here are properties with ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}.\n` +
                   `You can refine your search by adding:\n` +
                   `- Location (e.g., "in Chicago")\n` +
                   `- Price (e.g., "under $300,000")\n` +
                   `- Property type (e.g., "condo")`;
    }
  }
  // Handle all other cases
  else {
    const filters = [];
    if (detectedType) filters.push(detectedType);
    if (bedrooms) filters.push(`${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}`);
    if (priceValue) {
      filters.push(`${priceType === "below" ? 'under' : priceType === "above" ? 'above' : 'at'} $${priceValue.toLocaleString()}`);
    }
    if (location) filters.push(`in ${location}`);
    if (bathrooms) filters.push(`${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}`);
    if (size) filters.push(`${size} sqft`);
    if (amenities.length > 0) filters.push(`with ${amenities.join(", ")}`);

    if (usedIdFilter) {
      if (matchedProperties.length === 0) {
        botMessage = `No properties found with IDs: ${propertyIds.join(", ")}.`;
      } else {
        botMessage = `Found ${matchedProperties.length} propert${matchedProperties.length === 1 ? 'y' : 'ies'} with IDs: ${propertyIds.join(", ")}`;
      }
    } else if (filters.length > 0) {
      if (matchedProperties.length === 0) {
        botMessage = `No properties found with ${filters.join(' ')}.\n` +
                     `Suggestions:\n` +
                     `- Broaden your search criteria\n` +
                     `- Check nearby locations\n` +
                     `- Adjust price range or amenities`;
      } else {
        botMessage = `Found ${matchedProperties.length} properties with ${filters.join(' ')}:`;
      }
    } else {
      botMessage = matchedProperties.length > 0 
        ? "Here are some properties matching your query:"
        : "I couldn't find matching properties. Please try:\n" +
          "- Different search terms\n" +
          "- Fewer filters\n" +
          "- Checking for typos";
    }
  }
  return res.json({
    message: botMessage,
    properties: matchedProperties
  });
};

// Detect property type with variants
function detectPropertyType(msg) {
  const typeVariants = {
    apartment: ["apartment", "apartments", "apt", "apts"],
    villa: ["villa", "villas"],
    duplex: ["duplex", "duplexes"],
    penthouse: ["penthouse", "penthouses"],
    studio: ["studio", "studios"],
    condo: ["condo", "condos"],
    house: ["house", "houses"],
    townhouse: ["townhouse", "townhouses", "town home"],
    "smart home": ["smart home", "smarthome"]
  };

  for (const [type, variants] of Object.entries(typeVariants)) {
    const regex = new RegExp(`\\b(?:${variants.join('|')})\\b`, 'i');
    if (regex.test(msg)) {
      return type;
    }
  }
  return null;
}

// Extract bathrooms
function extractBathrooms(msg) {
  const match = msg.match(/(\d+)\s*(?:bath|bathroom|bathrooms|baths|ba|bth)/i);
  return match ? Number(match[1]) : null;
}

// Extract size
function extractSize(msg) {
  const match = msg.match(/(\d+)\s*(?:sqft|sq ft|square feet|sqm|sq m)/i);
  return match ? Number(match[1]) : null;
}