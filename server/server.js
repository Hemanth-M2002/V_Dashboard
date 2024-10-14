// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blackcofferDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define a schema and model (adjust based on your actual data structure)
const DataSchema = new mongoose.Schema({
    title: String,
    intensity: Number,
    likelihood: Number,
    sector: String,
    topic: String,
    region: String,
    country: String,
    added: String,
    published: String,
    relevance: Number,
});

const DataModel = mongoose.model('Data', DataSchema);

// API endpoint to get the data
app.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
