const express = require("express");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", userRoutes);

module.exports = app;
