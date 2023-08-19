import { api, requestConfig } from "../utils/config";

// Get user details
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  const res = await fetch(api + "/users/profile", config)

  const profile = await res.json();

  return profile;
};

// Update user details
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  const res = await fetch(api + "/users/", config)

  const profile = await res.json();

  return profile;
};

// Get user details
const getUserDetails = async (id) => {
  const config = requestConfig("GET");

  const res = await fetch(api + "/users/" + id, config)

  const details = await res.json();

  return details;
};


// Get all Nutritionists
const getAllNutritionist = async () => {
  const config = requestConfig("GET");

  const res = await fetch(api + "/users?isNutritionist=true", config)

  const nutritionists = await res.json();

  return nutritionists;
};

const updateFollowers = async (id, nutritionistId, token) => {
  const config = requestConfig("PUT", { nutritionistId }, token);
  await fetch(api + "/users/followers/" + id, config)
};

const acceptFollowers = async (id, userId, token) => {
  const config = requestConfig("PUT", { userId }, token);
  await fetch(api + "/users/acceptFollower/" + id, config)
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
  getAllNutritionist,
  updateFollowers,
  acceptFollowers,
};

export default userService;
