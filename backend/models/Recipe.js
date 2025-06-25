const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: String,
  instructions: String
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
