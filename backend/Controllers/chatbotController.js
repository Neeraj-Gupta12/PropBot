
// import fs from "fs";
// import path from "path";

// // Load property data from JSON files
// const basicsPath = path.resolve("./backend/data/property_basics.json");
// const characteristicsPath = path.resolve("./backend/data/property_characteristics.json");
// const imagesPath = path.resolve("./backend/data/property_images.json");

// const propertyBasics = JSON.parse(fs.readFileSync(basicsPath, "utf-8"));
// const propertyCharacteristics = JSON.parse(fs.readFileSync(characteristicsPath, "utf-8"));
// const propertyImages = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));

// // Common chatbot responses
// const commonResponses = {
//   "hi": "Hello! How can I assist you with properties today?",
//   "hello": "Hi there! I am PropBot, developed by agent Mira. How can I help you?",
//   "hey": "Hey! How can I help you find your dream property?",
//   "my name is": "My name is PropBot, developed by agent Mira.",
//   "who are you": "I am PropBot, your professional property assistant developed by agent Mira.",
//   "help": "You can ask me to find properties by location, price, amenities, or any feature you want!",
//   "thank you": "You're welcome! Let me know if you need anything else.",
//   "thanks": "Glad to help!",
//   "bye": "Goodbye! Have a great day!"
// };

// // Helper: merge all property data by id
// function mergePropertiesData() {
//   return propertyBasics.map(basic => {
//     const characteristics = propertyCharacteristics.find(c => c.id === basic.id) || {};
//     const image = propertyImages.find(img => img.id === basic.id) || {};
//     return { ...basic, ...characteristics, ...image };
//   });
// }

// // Helper: filter properties by keywords in any field
// function filterPropertiesByMessage(message) {
//   const keywords = message.toLowerCase().split(/\s+/);
//   const allProperties = mergePropertiesData();
//   return allProperties.filter(property => {
//     return keywords.some(word =>
//       Object.values(property).some(val =>
//         typeof val === "string"
//           ? val.toLowerCase().includes(word)
//           : Array.isArray(val)
//             ? val.some(item => item.toLowerCase().includes(word))
//             : false
//       )
//     );
//   });
// }

// // Helper: create a short description for a property
// function propertyShortDesc(property) {
//   return `${property.title} in ${property.location} for $${property.price}`;
// }

// // Main chatbot controller
// export const chatbotController = (req, res) => {
//   const { message } = req.body;
//   if (!message) {
//     return res.status(400).json({ message: "Message is required." });
//   }

//   // Check for common responses
//   const lowerMsg = message.toLowerCase();
//   for (const key in commonResponses) {
//     if (lowerMsg.includes(key)) {
//       return res.json({
//         message: commonResponses[key],
//         properties: []
//       });
//     }
//   }

//   // Filter properties based on message
//   const matchedProperties = filterPropertiesByMessage(message);
//   if (matchedProperties.length > 0) {
//     const shortDescriptions = matchedProperties.map(propertyShortDesc);
//     return res.json({
//       message: `Here are some properties matching your query: ${shortDescriptions.join("; ")}`,
//       properties: matchedProperties
//     });
//   } else {
//     return res.json({
//       message: "Sorry, I couldn't find any properties matching your request. Please try different keywords.",
//       properties: []
//     });
//   }
// };