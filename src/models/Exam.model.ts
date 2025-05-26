import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  college_associated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  remarks: {
    type: String
  }
});

const Exam = mongoose.model("Exam", ExamSchema);
export default Exam;
