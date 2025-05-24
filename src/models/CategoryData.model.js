import mongoose from "mongoose";

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

export default CategoryData = mongoose.model("CategoryData", CategoryDataSchema);
