import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  stream: {
    type: String,
    enum: ["Engineering", "Medical"],
    default: "Engineering"
  },
  colleges_applied: {

  }
}, {
  timestamps: true
});

export default User = mongoose.model("User", UserSchema);
