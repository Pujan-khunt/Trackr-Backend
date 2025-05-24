import mongoose from "mongoose"

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  date_of_establishment: {
    type: Date,
    required: true,
  },
  college_type: {
    type: String,
    enum: ["Private", "Government"],
    required: true,
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    validate: {
      validator: function(courses) {
        return courses && courses instanceof Array && courses.length > 0;
      },
      message: "Each College Must Have Atleast One Course",
    }
  },
  contact_info: {
    address: {
      state: { type: String, required: true },
      city: { type: String, required: true },
    },
    phone_number: {
      type: String,
      required: true,
    },
    website: { type: String, required: true }
  },
}, { timestamps: true })

export default College = mongoose.model("College", CollegeSchema);
