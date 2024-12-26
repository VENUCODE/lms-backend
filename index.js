const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const laptopRoutes = require("./routes/laptopRoutes");

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());

app.use("/api/laptops", laptopRoutes);

const port = process.env.PORT || 8000;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
