import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.util.js";

export const verifyJWT = (req, _res, next) => {
  // Extracting the authorization header from the request
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Checking if the authorization header starts with "Bearer "
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization header is missing.");
  }

  // Extracting the token from the authorization header
  const accessToken = authHeader.split(" ")[1];
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  // Attaching the username, id and email from the decoded token to the request object for easier access.
  req.userId = decoded.id;
  req.email = decoded.email;
  next();
};
