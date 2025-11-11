const mongoose = require("mongoose");
const app = require("./server");

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/JestDB";

async function connectWithRetry() {
  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`Connected to MongoDB at ${MONGO_URL}`);
      connected = true;
    } catch (err) {
      console.log("MongoDB not ready yet, retrying in 5s...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

connectWithRetry();
