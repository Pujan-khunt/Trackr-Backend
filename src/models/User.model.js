import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  colleges_applied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
    default: [],
  }
}, {
  timestamps: true
});

export default User = mongoose.model("User", UserSchema);
