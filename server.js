const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/posts");

const app = express();
app.use(express.json());
app.use("/api", routes);

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/devopsDB";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Start the server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
