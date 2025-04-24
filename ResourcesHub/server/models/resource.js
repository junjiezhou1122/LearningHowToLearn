import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    index: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    index: true,
  },
  provider: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "All Levels", ""],
  },
  resourceType: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    default: "English",
  },
  instructors: {
    type: [String],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    min: 0,
  },
  duration: {
    type: String,
  },
  subtitles: {
    type: String,
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

// Create indexes for better query performance
resourceSchema.index({ title: 1 });
resourceSchema.index({ url: 1 }, { unique: true });
resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ provider: 1 });
resourceSchema.index({ difficulty: 1 });

// Update the 'updatedAt' field on document update
resourceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
