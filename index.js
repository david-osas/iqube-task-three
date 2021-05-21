require("dotenv").config();
const express = require("express");
const app = express();
const reviewRoutes = require("./routes/index");

app.use(express.json());

app.use("/reviews", reviewRoutes);

app.listen(3000, () => {
  console.log("app started on port 3000");
});
