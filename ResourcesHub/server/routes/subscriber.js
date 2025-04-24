import express from "express";
import Subscriber from "../models/subscriber.js";

const router = express.Router();

// Add a new subscriber
router.post("/", async (req, res) => {
  try {
    console.log("Received subscription request with body:", req.body);
    
    const { email } = req.body;
    
    if (!email) {
      console.log("Email is missing in the request");
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`Processing subscription for email: ${email}`);

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      console.log(`Email already exists: ${email}, active: ${existingSubscriber.active}`);
      
      if (!existingSubscriber.active) {
        // Reactivate subscription
        existingSubscriber.active = true;
        await existingSubscriber.save();
        console.log(`Reactivated subscription for: ${email}`);
        return res
          .status(200)
          .json({ message: "Your subscription has been reactivated!" });
      }
      return res
        .status(400)
        .json({ message: "You are already subscribed to our newsletter." });
    }

    // Create new subscriber
    console.log(`Creating new subscriber for: ${email}`);
    const newSubscriber = new Subscriber({ email });
    const savedSubscriber = await newSubscriber.save();
    console.log(`Successfully saved new subscriber: ${email}`, savedSubscriber);

    res.status(201).json({
      message: "Thank you for subscribing to our newsletter!",
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      message: "An error occurred during subscription. Please try again later.",
      error: error.message,
    });
  }
});

export default router;
