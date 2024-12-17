// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 4001;

// const mongoURI = process.env.MONGO_URI;
// // MongoDB Connection
// mongoose.connect(mongoURI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => {
//         console.error('MongoDB connection error:', err);
//         process.exit(1); // Exit process with failure
//     });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');

// // User Schema and Model
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
//     age: { type: Number, required: true, min: 1 }
// });

// const User = mongoose.model('User', userSchema);

// // Routes

// // Home - List all users
// app.get('/', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.render('index', { users });
//     } catch (err) {
//         console.error(err);
//         res.render('error', { message: 'Error fetching users' });
//     }
// });

// // Add a new user
// app.post('/users', async (req, res) => {
//     const { name, email, age } = req.body;
//     try {
//         const newUser = new User({ name, email, age });
//         await newUser.save();
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.render('error', { message: 'Error adding user' });
//     }
// });

// // Edit user form
// app.get('/users/edit/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.render('edit', { user });
//     } catch (err) {
//         console.error(err);
//         res.render('error', { message: 'Error fetching user details' });
//     }
// });

// // Update a user
// app.post('/users/edit/:id', async (req, res) => {
//     const { name, email, age } = req.body;
//     try {
//         await User.findByIdAndUpdate(req.params.id, { name, email, age });
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.render('error', { message: 'Error updating user' });
//     }
// });

// // Delete a user
// app.post('/users/delete/:id', async (req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id);
//         res.redirect('/');
//     } catch (err) {
//         console.error(err);
//         res.render('error', { message: 'Error deleting user' });
//     }
// });

// // Error route
// app.get('/error', (req, res) => {
//     res.render('error', { message: 'Something went wrong' });
// });

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Middleware
app.use(express.json());

// Define a generic Schema function
const createModel = (modelName, schemaDefinition) => {
    const schema = new mongoose.Schema(schemaDefinition);
    return mongoose.model(modelName, schema);
};

// Dynamically create User model (can be reused for other models)
const User = createModel('User', {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    age: { type: Number, required: true, min: 1 }
});

// Routes

// Get all resources (users)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// Add a new user
app.post('/api/users', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const newUser = new User({ name, email, age });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error adding user', error: err });
    }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

// Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
