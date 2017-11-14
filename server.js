var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// requires all models
var db = require("./models");

// sets env PORT
var PORT = process.env.PORT || 8080;

// initializes Express
var app = express();

// initiate handlebars with default layout
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// uses body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// uses express.static to serve the public folder as a static directory
app.use(express.static("public"));

// sets mongoose to leverage built in JavaScript ES6 Promises
// connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/onlineRecipes";
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

// calls on routes/controllers
var recipesController = require('./controllers/recipes-controller');
recipesController(app, db);

// starts the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
