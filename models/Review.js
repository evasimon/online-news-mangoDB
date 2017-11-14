var mongoose = require("mongoose");

// saves a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, creates a new ReviewSchema object
var ReviewSchema = new Schema({
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Review = mongoose.model("Review", ReviewSchema);

// Export the Review model
module.exports = Review;
