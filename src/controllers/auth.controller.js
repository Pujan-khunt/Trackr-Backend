import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import z from "zod";
import User from "../models/User.model.js";
import generateTokens from "../utils/generateTokens.js";

export const loginUser = () => {

}

const signUpUserPayloadSchema = z.object({
  email: z.string().min(1, "Username needs to be of type String.").email(),
  password: z.string().min(8, "Password needs to have atleast 8 characters"),
});

function validatePayloadWithZod(payload) {
  try {
    signUpUserPayloadSchema.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.dir(error.issues)
      throw new ApiError(400, "Invalid information. Check errors for better understanding.", error.issues)
    }
  }
}

const expiresInSeconds = 15 * 60; // 15 minutes or 900 seconds

export const signUpUser = asyncHandler(async (req, res) => {
  const signUpUserPayload = req.body;
  const { email, password } = signUpUserPayload;
  console.log(email, password)

  // Check for empty username or password
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required fields");
  }

  // Validate User Information with zod schema
  validatePayloadWithZod(signUpUserPayload);

  // Check for existing users with same username
  if (await User.findOne({ email }).exec()) {
    throw new ApiError(409, "Email already registered with us.")
  }

  // Creating user. (Password will be automatically hashed in the pre-save hook for the User model)
  const newUser = await User.create({
    email,
    password,
  });

  // Generate JWT Tokens.
  const { accessToken, refreshToken } = generateTokens(newUser);

  // Save that refresh token that isn't used and is valid.
  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  // Send access token and time until it expires.
  return res.status(201).json(new ApiResponse(
    201,
    {
      email: newUser.email,
      accessToken,
      expiresIn: expiresInSeconds
    },
    "User created successfully."
  ))
});
