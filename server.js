const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/InstituteTimeTable")

// Mongoose Schema
const TeacherSchema = new mongoose.Schema({
  name: String,
  teacherID: Number,
  subject: String,
});

const Teacher = mongoose.model('teachers', TeacherSchema);

// POST: Save Teachers to DB (Avoiding Duplicate IDs)
app.post('/api/teachers', async (req, res) => {
  try {
    const { teachers } = req.body;
    const newTeachers = [];

    for (const teacher of teachers) {
      const exists = await Teacher.findOne({ teacherID: teacher.teacherID });
      if (!exists) {
        newTeachers.push(teacher);
      }
    }

    if (newTeachers.length > 0) {
      await Teacher.insertMany(newTeachers);
      res.status(201).json({ message: "✅ New teacher(s) stored successfully." });
    } else {
      res.status(200).json({ message: "⚠️ All teachers already exist in the database." });
    }
  } catch (error) {
    console.error("POST error:", error);
    res.status(500).json({ error: "❌ Server Error" });
  }
});

// ✅ GET: Fetch all teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "❌ Failed to fetch teachers." });
  }
});

// Server Listening
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
