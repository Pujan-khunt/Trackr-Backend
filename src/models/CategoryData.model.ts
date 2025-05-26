import mongoose from "mongoose";

const CASTE_CATEGORIES = ["SC", "ST", "OBC", "General", "PWD"]

const CategoryDataSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: CASTE_CATEGORIES,
    required: true,
  },
  cutoff_marks: {
    type: Number,
    required: true,
    min: 0,
  },
  annual_fee: {
    type: Number,
    required: true,
    min: 0,
  }
});

const CategoryData = mongoose.model("CategoryData", CategoryDataSchema);
export default CategoryData;
