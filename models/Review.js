var mongoose = require("mongoose");

// saves a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, creates a new ReviewSchema object
var ReviewSchema = new Schema({
  // `body` is of type String
  body: String
});

// creates the model from the above schema, using mongoose's model method
var Review = mongoose.model("Review", ReviewSchema);

// Export the Note model
module.exports = Review;
