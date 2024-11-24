const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Add your Razorpay Key ID to your .env file
  key_secret: process.env.RAZORPAY_SECRET_KEY, // Add your Razorpay Secret Key to your .env file
});

// Endpoint for payment processing
app.post("/pay", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    // Create an order in Razorpay
    const options = {
      amount: amount * 100, // Amount in the smallest unit (e.g., paise for INR)
      currency: currency,
      receipt: receipt || "receipt#1", // Optional
    };

    const order = await razorpay.orders.create(options);

    // Send order details back to the client
    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).send("Payment initiation failed");
  }
});

// Endpoint to verify Razorpay payment signature
app.post("/verify", (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).send("Payment verified successfully");
  } else {
    res.status(400).send("Invalid signature, payment verification failed");
  }
});

// Custom Chatbot endpoint
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Simple chatbot logic with main options and sub-options
  let botResponse;

  switch (userMessage.toLowerCase()) {
    case "hello":
      botResponse = "Hello! How can I assist you today? Here are some main options:\n1. Shop\n2. Customer Support\n3. Shipping & Returns\n4. Promotions\n5. Account Management";
      break;
    case "shop":
      botResponse = "Great! Here are some categories you can explore:\n1. New Arrivals\n2. Men's Clothing\n3. Women's Clothing\n4. Accessories\n5. Sale Items";
      break;
    case "customer support":
      botResponse = "How can I help you with customer support? Please choose:\n1. Report an Incident\n2. Track My Order\n3. Change My Order";
      break;
    case "shipping & returns":
      botResponse = "Please select an option:\n1. Shipping Information\n2. Return Policy\n3. Exchange Process";
      break;
    case "promotions":
      botResponse = "Here are some options regarding promotions:\n1. Current Discounts\n2. Loyalty Program\n3. Gift Cards";
      break;
    case "account management":
      botResponse = "What would you like to do?\n1. Update Profile Information\n2. Change Password\n3. View Order History";
      break;

    // Sub-options for shopping
    case "new arrivals":
      botResponse = "Check out our latest styles! Would you like to see:\n1. Dresses\n2. Tops\n3. Bottoms";
      break;
    case "men's clothing":
      botResponse = "Explore our men's collection! Choose a category:\n1. Shirts\n2. Pants\n3. Outerwear";
      break;
    case "women's clothing":
      botResponse = "Discover our women's collection! Select a category:\n1. Dresses\n2. Blouses\n3. Skirts";
      break;
    case "accessories":
      botResponse = "Looking for accessories? Choose from:\n1. Bags\n2. Jewelry\n3. Hats";
      break;
    case "sale items":
      botResponse = "Don't miss our sale! What are you interested in?\n1. Up to 50% off items\n2. Clearance items\n3. Seasonal sales";
      break;

    // Sub-options for customer support
    case "report an incident":
      botResponse = "I'm sorry to hear that! Please provide details about the incident.";
      break;
    case "track my order":
      botResponse = "Please provide your order number to track your order status.";
      break;
    case "change my order":
      botResponse = "To change your order, please provide your order number and the changes you'd like to make.";
      break;

    // Sub-options for shipping & returns
    case "shipping information":
      botResponse = "We offer free shipping on orders over $50! Would you like to know about delivery times or shipping methods?";
      break;
    case "return policy":
      botResponse = "You can return any item within 30 days of purchase for a full refund if it is in its original condition.";
      break;
    case "exchange process":
      botResponse = "To exchange an item, please return it first and place a new order for the desired item.";
      break;

    // Sub-options for promotions
    case "current discounts":
      botResponse = "Check our 'Offers' page for current discounts and seasonal sales!";
      break;
    case "loyalty program":
      botResponse = "Join our loyalty program to earn points on every purchase! Would you like to sign up?";
      break;
    case "gift cards":
      botResponse = "Yes! We offer gift cards in various amounts available on our website.";
      break;

    // Sub-options for account management
    case "update profile information":
      botResponse = "You can update your profile information in the 'Account Settings' section of our website.";
      break;
    case "change password":
      botResponse = "To change your password, go to 'Account Settings' and select 'Change Password'.";
      break;
    case "view order history":
      botResponse = "You can view your order history in the 'My Orders' section of your account.";
      break;

    default:
      botResponse = `I'm sorry, I didn't understand that.\nYou can say 'hello' to start or choose from the following main options:\n1. Shop\n2. Customer Support\n3. Shipping & Returns\n4. Promotions\n5. Account Management`;
      break;
  }

  // Send the response back to the client
  res.json({ response: botResponse });
});

// Basic endpoint for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});