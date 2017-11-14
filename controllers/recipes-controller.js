// scraping tools : Axios is a promised-based http library, similar to jQuery's Ajax method
// works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app, db) {

    // A POST route for scraping the blueapron website
    app.post("/scrape", function (req, res) {
        // grabs the body of the html with request
        axios.get("https://www.blueapron.com/cookbook").then(function (response) {
            // loads that into cheerio and saves it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // grabs every div with .recipe-thumb class and does the following:
            $("div.recipe-thumb").each(function (i, element) {
                // saves an empty result object
                var result = {};

                // adds the text and href of every link, and saves them as properties of the result object
                result.title = $(this)
                    .find("h3")
                    .text();
                result.link = "https://www.blueapron.com" + $(this)
                    .find("a")
                    .attr("href");
                result.description = $(this)
                    .find("h6")
                    .text();
                result.img = $(this)
                    .find("img")
                    .attr("src");

                // checks if title, link, descr, img exists
                if (result.title && result.link && result.description && result.img) {
                    // create a new Recipe using the `result` object built from scraping
                    db.Recipe.findOne({ link: result.link }).then(function (data) {
                        // if recipe does not exist
                        if (!data) {
                            // then creates a new recipe
                            db.Recipe
                                .create(result)
                                .then(function (dbRecipe) {
                                    // sends a succesful message to the client
                                    res.send("Scrape Complete");
                                })
                                .catch(function (err) {
                                    // sends error msg to the client
                                    res.json(err);
                                });
                        }

                    });

                }
            });
            // redirects to all recipes
            res.redirect('/');
        });
    });

    // Route for getting all Recipes from the db
    app.get("/", function (req, res) {
        // grabs all of the recipes
        db.Recipe
            .find({})
            .then(function (data) {
                var result = {};
                result.recipes = data;
                // renders index.handlebars
                res.render("index", result);
            });
    });

    // Route for getting all the saved Recipes from the db
    app.get("/saved-recipes", function (req, res) {
        // grabs all of the recipes that are set to saved: true
        db.Recipe
            .find({ saved: true })
            .then(function (data) {
                // console.log(data)
                var result = {};
                result.recipes = data;
                // renderes my-recipes.handlebars
                res.render("my-recipes", result);
            })
    });

    // Route for grabbing a specific Recipe by id, populate it with its review
    app.get("/recipes/:id", function (req, res) {
        var recipeId = req.params.id;

        // finds one recipe using the req.params.id,
        db.Recipe
            .findOne({ _id: recipeId })
            // runs the populate method with "reviews",
            .populate("reviews")
            .then(function (data) {
                // then responds with the recipe with the reviews included
                res.json(data)
            })
    });

    // Route for saving/updating a Recipe's associated Review
    app.post("/recipes/:id", function (req, res) {
        // grabs the specific Recipe by id
        var recipeId = req.params.id;
        // saves the new review that gets posted to the Review collection
        db.Review
            .create(req.body)
            .then(function (dbReview) {
                return db.Recipe
                    .findOneAndUpdate({ _id: recipeId }, { $push: { reviews: dbReview._id } }, { new: true })
                    .populate("reviews");
            })
            .then(function (dbRecipe) {
                res.json(dbRecipe);
            })
    });

    // Route for updating saved prop. for a specific Recipe
    app.put("/recipes/:id", function (req, res) {
        // grabs the specific Recipe by id
        var recipeId = req.params.id;
        // updates the recipe saved to true
        db.Recipe
            .findOneAndUpdate({ _id: recipeId }, { saved: true })
            .then(function (data) {
                console.log('On Server: recipe saved')
                res.json(data)
            })
    });

    // Route for updating a Saved Recipe to false
    app.put("/recipes/delete/:id", function (req, res) {
        // grabs the specific Recipe by id
        var recipeId = req.params.id;
        // updates the Recipe saved to false
        db.Recipe
            .findOneAndUpdate({ _id: recipeId }, { saved: false })
            .then(function (data) {
                console.log('On Server: recipe deleted')
                res.json(data)
            })
    });

    // Route for deleting a review specific to a Recipe
    app.delete("/review/delete/:id", function (req, res) {
        // grabs the specific Review by id
        var reviewId = req.params.id;
        // removes it from the Review Collecition
        db.Review
            .findOneAndRemove({ _id: reviewId })
            .then(function (data) {
                console.log('On Server: review deleted')
                res.json(data)
            })
    });

}