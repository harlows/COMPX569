// Load a .env file if one exists
require('dotenv').config()

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

// Listen port will be loaded from .env file, or use 3000
const port = process.env.EXPRESS_PORT || 3000;

// Setup Handlebars
app.engine("handlebars", handlebars.create({
    defaultLayout: "main"
    // helpers: require("./js/handlebars.js").helpers
}).engine);
app.set("view engine", "handlebars");

var hbs = handlebars.create({});

// register new function to check if a == b
hbs.handlebars.registerHelper("checkIf", function(a, b) {
      if (a === b) {
          return "checked";
      }
      return "";
    });

// Set up to read POSTed form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));

// Setup express-session
const session = require("express-session");
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "COMPX569"
}));

// TODO: Your app here

// Make the "public" folder available statically
const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

// Setup our routes
const account = require("./routes/account-routes.js");
app.use("/account", account);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

app.listen(port, function () {
    console.log(`Web final project listening on http://localhost:${port}/`);
});
