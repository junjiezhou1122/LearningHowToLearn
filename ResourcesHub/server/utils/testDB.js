import mongoose from "mongoose";
import dotenv from "dotenv";
import Subscriber from "../models/subscriber.js";

dotenv.config();

// Test function to insert a subscriber
async function testInsertSubscriber(email) {
  try {
    // Connect to MongoDB with explicit database name
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "newsletter",
    });

    console.log("Connected to MongoDB");

    // Log current collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Current collections:",
      collections.map((c) => c.name)
    );

    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      console.log(`Email ${email} already exists in the database:`);
      console.log(existingSubscriber);
    } else {
      // Create a new subscriber
      const newSubscriber = new Subscriber({ email });
      const savedSubscriber = await newSubscriber.save();

      console.log("New subscriber saved successfully:");
      console.log(savedSubscriber);
    }

    // Check all subscribers in the collection
    const allSubscribers = await Subscriber.find();
    console.log(`Total subscribers in database: ${allSubscribers.length}`);
    console.log("All subscribers:");
    console.log(allSubscribers);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the test with the email provided as command line argument or use default
const testEmail = process.argv[2] || "menging1122@gmail.com";
testInsertSubscriber(testEmail);
