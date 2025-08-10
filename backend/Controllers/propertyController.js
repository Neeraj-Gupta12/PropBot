
import mongoose from "mongoose";
import User from "../Modals/userModal.js";
import property_basics from "../data/property_basics.json" with { type: "json" };
import property_characteristics from "../data/property_characteristics.json" with { type: "json" };
import property_images from "../data/property_images.json" with { type: "json" };
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import nlp from "compromise";



// Utility to merge property data from 3 JSON files (ESM compatible)
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

// Get all properties (merged from JSON files)
export const getAllProperties = catchAsyncError(async (req, res, next) => {
  const merged = mergePropertiesData();
  res.status(200).json({
    success: true,
    count: merged.length,
    properties: merged,
  });
});

// Get single property by ID (merged from JSON files)
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
    // Support multiple locations: array or comma-separated string
    let locationArr = [];
    if (Array.isArray(location)) {
      locationArr = location;
    } else if (typeof location === 'string') {
      locationArr = location.split(',').map(l => l.trim()).filter(Boolean);
    }
    if (locationArr.length > 0) {
      results = results.filter((p) =>
        p.location && locationArr.some(loc => p.location.toLowerCase().includes(loc.toLowerCase()))
      );
    } else {
      // fallback to single location string
      results = results.filter((p) => p.location && p.location.toLowerCase().includes(location.toLowerCase()));
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
  // Save as string, not ObjectId
  if (user.savedProperties.map(id => id.toString()).includes(propertyId.toString())) {
    return res.status(200).json({ success: true, message: "Property already saved" });
  }
  user.savedProperties.push(propertyId.toString());
  await user.save();
  res.status(200).json({ success: true, message: "Property saved successfully" });
});

// Unsave a property for a user
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

// Get all saved properties for a user
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

// Suggestion controller for chatbot predefined suggestions
export const suggestionController = catchAsyncError(async (req, res, next) => {
  const { suggestion } = req.query;
  console.log(suggestion, "suggestion from frontend");
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

  // 1. Handle "Show me properties under $500,000"
  if (s === "show me properties under $500,000") {
    filtered = filtered.filter(p => p.price <= 500000);
  }

  // 2. Handle "I want a 3-bedrooms apartment in New York"
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
  
  // 3. Handle "Find Apartment with a swimming pool"
  else if (s === "find apartment with a swimming pool") {
    filtered = filtered.filter(p => 
      (p.title.toLowerCase().includes("apartment") || p.type?.toLowerCase() === "apartment") &&
      Array.isArray(p.amenities) && 
      p.amenities.some(a => a.toLowerCase().includes("swimming pool"))
    );
  }
  
  // 4. Handle "Show me villas with a private garden"
  else if (s === "show me villas with a private garden") {
    filtered = filtered.filter(p => 
      (p.title.toLowerCase().includes("villa") || p.type?.toLowerCase() === "villa") &&
      Array.isArray(p.amenities) && 
      p.amenities.some(a => a.toLowerCase().includes("private garden"))
    );
  }
  
  console.log(filtered, "suggestion from backend");
  res.status(200).json({
    success: true,
    count: filtered.length,
    properties: filtered,
  });
});

// --- Property Chatbot Controller ---
// Common chatbot responses
const commonResponses = {
  "hi": "Hello! How can I assist you with properties today?",
  "hello": "Hi there! I am PropBot, developed by agent Mira. How can I help you?",
  "hey": "Hey! How can I help you find your dream property?",
  "my name is": "My name is PropBot, developed by agent Mira.",
  "who are you": "I am PropBot, your professional property assistant developed by agent Mira.",
  "help": "You can ask me to find properties by location, price, amenities, or any feature you want!",
  "thank you": "You're welcome! Let me know if you need anything else.",
  "thanks": "Glad to help!",
  "bye": "Goodbye! Have a great day!"
};

// Helper: filter properties by keywords in any field
function filterPropertiesByMessage(message) {
  const keywords = message.toLowerCase().split(/\s+/);
  const allProperties = mergePropertiesData();
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

// Helper: create a short description for a property
function propertyShortDesc(property) {
  return `${property.title} in ${property.location} for $${property.price}`;
}

// Main chatbot controller with NLP (compromise)
export const chatbotController = (req, res) => {
  const { message } = req.query;
  if (!message) {
    return res.status(400).json({ message: "Message is required.", properties: [] });
  }

  const doc = nlp(message);
  const lowerMsg = message.toLowerCase();

  // Detect greeting
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
  const isGreeting = greetings.some(greet => lowerMsg.includes(greet));

  // Detect if user is telling their name
  let name = null;
  if (lowerMsg.includes("my name is")) {
    // Try to extract name after "my name is"
    const after = lowerMsg.split("my name is")[1];
    if (after) {
      name = after.trim().split(" ")[0];
    }
  } else {
    // Try to extract a Person entity
    const people = doc.people().out('array');
    if (people.length > 0) {
      name = people[0];
    }
  }

  // Extract preferences
  const budget = doc.match('#Money').values().toNumber().out('array')[0];
  const location = doc.places().out('array')[0];
  const bedrooms = doc.match('#Value #Noun').values().toNumber().out('array')[0] || doc.match('#Cardinal').values().toNumber().out('array')[0];

  // Professional, friendly responses
  let botMessage = "";
  if (isGreeting && name) {
    botMessage = `Hello ${name.charAt(0).toUpperCase() + name.slice(1)}, I'm PropBot, your professional property assistant. How can I help you today?`;
  } else if (isGreeting) {
    botMessage = "Hello! I'm PropBot, your professional property assistant. How can I help you today?";
  } else if (name) {
    botMessage = `Nice to meet you, ${name.charAt(0).toUpperCase() + name.slice(1)}! How can I assist you in finding your ideal property?`;
  } else if (lowerMsg.includes("who are you")) {
    botMessage = "I am PropBot, your professional property assistant developed by agent Mira. I can help you find properties based on your preferences.";
  } else if (lowerMsg.includes("thank you") || lowerMsg.includes("thanks")) {
    botMessage = "You're welcome! Let me know if you need anything else.";
  } else if (lowerMsg.includes("bye")) {
    botMessage = "Goodbye! Have a great day!";
  } else if (lowerMsg.includes("help")) {
    botMessage = "You can ask me to find properties by location, price, amenities, or any feature you want!";
  }

  // If user asks for property preferences
  let matchedProperties = [];
  if (budget || location || bedrooms) {
    // Use extracted preferences to filter
    let merged = mergePropertiesData();
    matchedProperties = merged.filter(p => {
      let match = true;
      if (budget) match = match && p.price <= budget;
      if (location) match = match && p.location && p.location.toLowerCase().includes(location.toLowerCase());
      if (bedrooms) match = match && Number(p.bedrooms) === Number(bedrooms);
      return match;
    });
    if (!botMessage) {
      botMessage = `Here are some properties matching your preferences${location ? ` in ${location}` : ''}${bedrooms ? ` with ${bedrooms} bedrooms` : ''}${budget ? ` under $${budget}` : ''}.`;
    }
  } else {
    // Fallback: filter by keywords in message
    matchedProperties = filterPropertiesByMessage(message);
    if (!botMessage) {
      if (matchedProperties.length > 0) {
        botMessage = `Here are some properties matching your query.`;
      } else {
        botMessage = "Sorry, I couldn't find any properties matching your request. Please try different keywords.";
      }
    }
  }
  console.log("Matched Properties:", matchedProperties);
  console.log("botMessage:", botMessage);
  // Always return properties (even if empty)
  return res.json({
    message: botMessage,
    properties: matchedProperties
  });
};