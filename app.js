const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const mongoose = require("./config/db");
const bookRoutes = require("./routes/bookroutes");
const usersRouter = require("./routes/users");
require("dotenv").config;
const port = process.env.PORT;
const httpStatuesText = require("./utilities/httpStatusText");

const app = express();

// Cors Middleware
app.use(cors());

//image Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set a static folder
app.use(express.static(path.join(__dirname, "client")));

// Body Parser Middleware for parsing application/json
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// Connected to database
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB at ${process.env.MONGO_URI}`);
});

mongoose.connection.on("error", (err) => {
  console.error("Database connection error: " + err);
});

// Use the routes
app.use("/api/users", usersRouter); // /api/users
app.use("/books", bookRoutes);

// Index Route
app.get("/", (req, res) => {
  res.send("<h1> Hello Donia's app </h1>");
});

// 404 Handler Middleware

app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatuesText.ERROR,
    message: "This Resource is Not Available",
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
