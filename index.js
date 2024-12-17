const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

const mongoURI = process.env.MONGO_URI;
// MongoDB Connection
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    age: { type: Number, required: true, min: 1 }
});

const User = mongoose.model('User', userSchema);

// Routes

// Home - List all users
app.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { users });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error fetching users' });
    }
});

// Add a new user
app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error adding user' });
    }
});

// Edit user form
app.get('/users/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('edit', { user });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error fetching user details' });
    }
});

// Update a user
app.post('/users/edit/:id', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { name, email, age });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error updating user' });
    }
});

// Delete a user
app.post('/users/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Error deleting user' });
    }
});

// Error route
app.get('/error', (req, res) => {
    res.render('error', { message: 'Something went wrong' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
