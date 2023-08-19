import { api, requestConfig } from "../utils/config";

// Register a user
const register = async (data) => {
  const config = requestConfig("POST", data);
  const res = await fetch(api + "/users/register", config)
  const user = await res.json();

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

// Logout a user
const logout = () => {
  localStorage.removeItem("user");
};

// Sign in a user
const login = async (data) => {
  const config = requestConfig("POST", data);
  const res = await fetch(api + "/users/login", config)
  const user = await res.json();

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
