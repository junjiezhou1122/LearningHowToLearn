import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// Add a post-save hook to log when a document is saved
subscriberSchema.post("save", function (doc) {
  console.log(`Subscriber saved successfully: ${doc.email}`);
});

// Force the collection name to 'subscribers'
const Subscriber = mongoose.model(
  "Subscriber",
  subscriberSchema,
  "subscribers"
);

export default Subscriber;
