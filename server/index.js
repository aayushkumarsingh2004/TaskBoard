const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. CONNECT TO MONGODB ---
// FIXED TYPO: Changed .o9qawtt to .e9qawtt
const connectionString = "mongodb+srv://admin:ProjectPass2025@cluster0.e9qawtt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString)
.then(() => console.log("✅ Connected to MongoDB Database!"))
.catch((err) => console.error("❌ Connection Error:", err));

// --- 2. DEFINE THE DATA STRUCTURE ---
const taskSchema = new mongoose.Schema({
    id: Number,
    title: String,
    status: String
});

const Task = mongoose.model('Task', taskSchema);

// --- 3. API ROUTES ---

// GET
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST
app.post('/tasks', async (req, res) => {
    const newTask = new Task({
        id: req.body.id,
        title: req.body.title,
        status: req.body.status
    });

    try {
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT
app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { id: taskId }, 
            { status: req.body.status }, 
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        await Task.findOneAndDelete({ id: taskId });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});