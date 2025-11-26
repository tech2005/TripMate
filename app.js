// Importing required modules
if(process.env.Node_ENV !="production") {
  require('dotenv').config();
}


console.log(process.env.SECRET);


console.log("Server started, check routes...");

process.removeAllListeners('warning');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");  
const User = require("./models/user.js");          
const listingRouter = require("./routes/listing.js");

const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");


// --------------------- DATABASE CONNECTION ---------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.log("Database connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// --------------------- APP CONFIGURATION ---------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// --------------------- SESSION & FLASH SETUP ---------------------
const sessionOptions = {
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  
  res.locals.error = req.flash("error");
 res.locals.currUser = req.user;

  next();
});




// --------------------- ROUTES ---------------------

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root route");
});

// Use listings route
app.use("/listings", listingRouter);

//  Use reviews route (correct spelling)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// --------------------- ERROR HANDLING ---------------------
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// --------------------- SERVER START ---------------------
app.listen(8080, () => {
  console.log(" Server running on http://localhost:8080");
});