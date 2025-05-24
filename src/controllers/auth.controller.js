import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import z from "zod";
import User from "../models/User.model.js";
import generateTokens from "../utils/generateTokens.js";

const MAX_SESSIONS = process.env.MAX_SESSIONS;

const loginUserPayloadSchema = z.object({
  email: z.string().min(1, "Username needs to be of type String").email(),
  password: z.string().min(8, "Password needs to have atleast 8 characters"),
})

function validateLoginPayloadWithZod(payload) {
  try {
    loginUserPayloadSchema.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.dir(error.issues)
      throw new ApiError(400, "Invalid Credentials.", error.issues)
    }
  }
}

export const loginUser = asyncHandler(async (req, res) => {
  const loginUserPayload = req.body;
  const { email, password } = loginUserPayload;

  // Validate login information with zod schema.
  validateLoginPayloadWithZod(loginUserPayload)

  // Check for missing email and password
  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and Password are required to authenticate the user.",
    )
  }

  // Find user with provided email
  const existingUser = await User.findOne({ email }).select("+password").exec();
  if (!existingUser) {
    throw new ApiError(
      400,
      "No user exists with provided email."
    )
  }

  // Verify user password
  const passwordComparisionResult = await existingUser.comparePassword(password);
  if (!passwordComparisionResult) {
    throw new ApiError(
      401,
      "Invalid Credentials."
    )
  }

  // Save refresh token in the DB.
  const { accessToken, refreshToken } = generateTokens(existingUser);

  // Only a set number of sessions are allowed per user
  if (existingUser.refreshTokens.length >= MAX_SESSIONS) {
    // Remove/Invalidate the oldest session and save after adding a new refresh token.
    existingUser.refreshTokens.shift();
  }

  // Add the new refresh token into db. (as its not been used to generate a new access token yet)
  existingUser.refreshTokens.push(refreshToken);
  await existingUser.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        expiresIn: expiresInSeconds
      },
      "Successfull Login :), Store access and refresh token in client side."
    )
  );
})

const signUpUserPayloadSchema = z.object({
  email: z.string().min(1, "Username needs to be of type String.").email(),
  password: z.string().min(8, "Password needs to have atleast 8 characters"),
});

function validateSignUpPayloadWithZod(payload) {
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

  // Check for empty username or password
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required fields");
  }

  // Validate User Information with zod schema
  validateSignUpPayloadWithZod(signUpUserPayload);

  // Check for existing users with same username
  if (await User.findOne({ email }).exec()) {
    throw new ApiError(409, "Email already registered with us.")
  }

  // Creating user. (Password will be automatically hashed in the pre-save hook for the User model)
  const newUser = await User.create({
    email,
    password,
  });
  await newUser.save();

  // Send access token and time until it expires.
  return res.status(201).json(new ApiResponse(
    201,
    "User created successfully."
  ))
});
