import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  amenities: [{
    type: String,
  }],
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
propertySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

propertySchema.index({ location: 'text', title: 'text' });
propertySchema.index({ price: 1, bedrooms: 1, bathrooms: 1, size: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;