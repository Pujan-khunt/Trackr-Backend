import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "College",
    default: [],
  },
  refreshTokens: [String]
}, {
  timestamps: true
});

const User = mongoose.model("User", UserSchema);
export default User;
