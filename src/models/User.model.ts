import mongoose from "mongoose";
import bcrypt from "bcrypt"

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

/**
 * Middleware to hash passwords whenever they are modified or set for the first time.
 * 
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) { return next(); }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compares the provided password with the stored hashed password.
 * 
 * @param {string} providedPassword - The password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the passwords match.
 */
UserSchema.methods.comparePassword = async function(providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

/**
 * Middleware to hash refresh tokens whenever they are modified or set for the first time.
 * 
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
UserSchema.pre("save", async function(next) {
  if (!this.isModified("refreshTokens")) { return next(); }

  this.refreshTokens = await Promise.all(
    this.refreshTokens.map(async (refreshToken) => {
      // Check if it's already hashed (bcrypt hashes start with $2b$)
      const alreadyHashed = refreshToken.startsWith("$2b$");

      if (alreadyHashed) {
        return refreshToken;
      }

      // If not hashed then hash using bcrypt.
      return await bcrypt.hash(refreshToken, 10);
    })
  );
  next();
});

/**
 * Returns true if the provided refresh token exists in the database, otherwise it returns false.
 * 
 * @param {string} providedRefreshToken - The refresh token to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the presence of refreshToken in the array.
 */
UserSchema.methods.compareRefreshToken = async function(providedRefreshToken) {
  const results = await Promise.all(
    // Will return an array of promises.(handled by Promise.all())
    this.refreshTokens.map((refreshToken) => bcrypt.compare(refreshToken, providedRefreshToken))
  );

  return results.includes(true);
};

/**
 * Returns the index of the refresh token in the array.
 * 
 * @param {string} providedRefreshToken - The refresh token to compare against.
 * @returns {Promise<number>} - A promise that resolves to the index of the provided refresh token in the array.
 */
UserSchema.methods.getRefreshTokenIndex = async function(providedRefreshToken) {
  const results = await Promise.all(
    this.refreshToken.map((refreshToken) => bcrypt.compare(refreshToken, providedRefreshToken))
  );

  console.log(results);
  results.findIndex((isMatching) => isMatching === true);
};

const User = mongoose.model("User", UserSchema);
export default User;
