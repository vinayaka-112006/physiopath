require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();

app.use(
  cors({
<<<<<<< HEAD
    origin: [
      "https://physiopath-client.onrender.com",
      "https://physiopath-client-vsr2.onrender.com",
    ],
    credentials: true,
  }),
=======
    origin: "https://physiopath-client-vsr2.onrender.com",
    credentials: true,
  })
>>>>>>> 3d4a67cb230131e2dd204864aaac8543ae4a7400
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/gemini", geminiRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
