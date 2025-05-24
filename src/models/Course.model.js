import mongoose from "mongoose";

const AVAILABLE_COURSES = [
  "Computer Science",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics and Communications Engineering",
  "Electronic and Electrical Engineering",
  "Data Science",
  "Artifical Intelligence & Machine Learning",
  "Cyber Security",
  "Computer Science & Business System",
  "Biotechnology",
  "Chemical Engineering",
  "Computational Linguistics",
  "Computational Natural Sciences",
  "Computing & Human Sciences",
]

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: AVAILABLE_COURSES,
    required: true,
  },
  total_seats: {
    type: Number,
    required: true,
    min: 1
  },
  seats_breakdown: {
    General: { type: Number, default: 0 },
    SC: { type: Number, default: 0 },
    ST: { type: Number, default: 0 },
    OBC_NCL: { type: Number, default: 0 },
    PWD: { type: Number, default: 0 },
  },
  category_data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryData",
  },
});

export default Course = mongoose.model("Course", CourseSchema);
