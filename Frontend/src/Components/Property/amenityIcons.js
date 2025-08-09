import { FaDumbbell, FaSwimmer, FaParking, FaUmbrellaBeach, FaShieldAlt, FaCouch, FaTree, FaMicrochip, FaCar, FaTshirt, FaUserShield, FaBinoculars, FaConciergeBell, FaRunning, FaShip, FaFireAlt, FaDog, FaSolarPanel, FaBriefcase, FaLeaf, FaPlug, FaBacon, FaLightbulb, FaQuestionCircle } from "react-icons/fa";
import { MdElevator } from "react-icons/md";

export const amenityIcons = {
  "Gym": FaDumbbell,
  "Swimming Pool": FaSwimmer,
  "Parking": FaParking,
  "Beach Access": FaUmbrellaBeach,
  "Security": FaShieldAlt,
  "Balcony": FaCouch,
  "Private Garden": FaTree,
  "Smart Home": FaMicrochip,
  "Garage": FaCar,
  "Laundry": FaTshirt,
  "Smart Security": FaUserShield,
  "Private Elevator": MdElevator,
  "Park View": FaBinoculars,
  "24/7 Concierge": FaConciergeBell,
  "Fitness Center": FaRunning,
  "Private Dock": FaShip,
  "Boat Parking": FaFireAlt,
  "BBQ Area": FaBacon,
  "Backyard": FaTree,
  "Community Pool": FaSwimmer,
  "Pet Friendly": FaDog,
  "Home Office": FaBriefcase,
  "Solar Panels": FaSolarPanel,
  "Two-Car Garage": FaCar,
  "Minimalist Design": FaLeaf,
  "Smart Appliances": FaPlug,
  "Energy Efficient": FaLightbulb
};

export const getAmenityIcon = (amenity) => amenityIcons[amenity] || FaQuestionCircle;
