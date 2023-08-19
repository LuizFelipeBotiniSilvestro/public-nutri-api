import { api, requestConfig } from "../utils/config";

// Publish an user's photo
const publishPhoto = async (data, token) => {
  const config = requestConfig("POST", data, token, true);

  const res = await fetch(api + "/photos", config)
  const photos = await res.json();

  return photos;
};

// Get user photos
const getUserPhotos = async (id) => {
  const config = requestConfig("GET");

  const res = await fetch(api + "/photos/user/" + id, config)

  const photos = await res.json();

  return photos;
};

// Get photo
const getPhoto = async (id) => {
  const config = requestConfig("GET");
  const res = await fetch(api + "/photos/" + id, config)

  const photos = await res.json();

  return photos;
};

// Delete a photo
const deletePhoto = async (id, token) => {
  const config = requestConfig("DELETE", "", token);
  const res = await fetch(api + "/photos/" + id, config)

  const photos = await res.json();

  return photos;
};

// Update a photo
const updatePhoto = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  const res = await fetch(api + "/photos/" + id, config)

  const photos = await res.json();

  return photos;
};

// Like a photo
const like = async (id, token) => {
  const config = requestConfig("PUT", null, token);

  const res = await fetch(api + "/photos/like/" + id, config)

  const likes = await res.json();

  return likes;
};

// Add a comment to a photo
const comment = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  const res = await fetch(api + "/photos/comment/" + id, config)

  const comment = await res.json();

  return comment;
};

// Get all photos
const getPhotos = async (id) => {
  const config = requestConfig("GET");

  const res = await fetch(api + "/photos/availableForUser/" + id, config)

  const photos = await res.json();

  return photos;
};

// Search photos by title
const searchPhotos = async (query) => {
  const config = requestConfig("GET");

  const res = await fetch(api + "/photos/search?q=" + query, config)
  
  const photos = await res.json();

  return photos;
};

const photoService = {
  publishPhoto,
  getUserPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto,
  like,
  comment,
  getPhotos,
  searchPhotos,
};

export default photoService;
