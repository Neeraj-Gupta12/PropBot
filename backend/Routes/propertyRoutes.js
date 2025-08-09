import express from "express";
import { getAllProperties, getProperty, filteredProperties, saveProperty, unsaveProperty,
     getSavedProperties,suggestionController,chatbotController } from "../Controllers/propertyController.js";
import { isAuthenticated  } from "../middleware/auth.js";

const router = express.Router();

router.get("/property/:id", getProperty);
router.post("/property/save", isAuthenticated, saveProperty);
router.post("/property/unsave", isAuthenticated, unsaveProperty);

router.get("/properties/saved", isAuthenticated, getSavedProperties);
router.get("/properties/all", getAllProperties);
router.get("/properties/filter", filteredProperties);
router.get("/properties/suggestions", suggestionController);
router.get("/properties/chatbot", chatbotController);

export default router;