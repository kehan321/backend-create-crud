const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://skyrrah999:zvsFOzq7GernQk9E@cluster0.uthoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



// const itemSchema = new mongoose.Schema({
// Define a Schema and Model

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);