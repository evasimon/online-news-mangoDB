var mongoose = require("mongoose");

// saves a reference to the Schema constructor
var Schema = mongoose.Schema;

// using the Schema constructor, creates a new UserSchema object
var RecipeSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `description` is required and of type String
  description: {
    type: String,
    required: true
  },
  // `img` is required and of type String
  img: {
    type: String,
    required: true
  },
  // `saved` is false by default and of type Boolean
  saved: {
    type: Boolean,
    default: false
  },
  // populates the Recipe with a corresponding Review
  // stores a Review id, (ref property) links the ObjectId to the Review model 
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
});

// creates the model from the above schema, using mongoose's model method
var Recipe = mongoose.model("Recipe", RecipeSchema);

// exports the Recipe model
module.exports = Recipe;
