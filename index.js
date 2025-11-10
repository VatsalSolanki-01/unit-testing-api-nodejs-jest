const mongoose = require("mongoose");
const app = require("./server");

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/JestDB";

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`✅ Connected to MongoDB at ${MONGO_URL}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server has started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // stop app if DB connection fails
  });
