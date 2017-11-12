var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/onlineRecipes", {
    useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://allrecipes.com/recipes/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        var array = [];

        // Now, we grab every h2 within an article tag, and do the following:
        $("article.fixed-recipe-card").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h3 a span")
                .text();
            result.link = $(this)
                .find("a")
                .attr("href");
            result.description = $(this)
                .find("a .fixed-recipe-card__description")
                .text();
            result.img = $(this)
                .find("img.fixed-recipe-card__img")
                .attr("data-original-src");
            array.push(result)

            if (result.title && result.link && result.description && result.img) {
                // Create a new Article using the `result` object built from scraping
                db.Recipe
                    .create(result)
                    .then(function (dbRecipe) {
                        // If we were able to successfully scrape and save an Article, send a message to the client
                        res.send("Scrape Complete");
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });
            }
        });
        // res.json(array);

    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}).then(function (data) {
        // console.log(data)
        res.json(data)
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    var articleId = req.params.id;
    console.log(articleId)

    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included

    db.Article.findOne({ _id: articleId }).populate("note").then(function (data) {
        // console.log(data)
        res.json(data)
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    var articleId = req.params.id;

    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    db.Note
        .create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: articleId }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbUser) {
            // If the User was updated successfully, send it back to the client
            res.json(dbUser);
        })
    // then find an article from the req.params.id

    // and update it's "note" property with the _id of the new note
    // db.Article.find({ _id: articleId }).populate("notes").then(function (data) {
    //   // console.log(data)
    //   res.json(data)
    // })
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
