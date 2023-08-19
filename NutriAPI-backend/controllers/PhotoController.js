const mongoose = require("mongoose");

const Photo = require("../models/Photo");
const User = require("../models/User");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
  try {
    const { title, scientificContent, postType } = req.body;
    
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    // Create photo
    const newPhoto = await Photo.create({
      image,
      title,
      scientificContent,
      userId: user._id,
      userName: user.name,
      userCRN: user.crn,
      isPrivate: parseInt(postType) === 0
    });

    // If user was photo sucessfully, return data
    if (!newPhoto) {
      return res.status(422).json({
        errors: ["Houve um erro, por favor tente novamente mais tarde."],
      });
    }

    res.status(201).json(newPhoto);
  } catch (error) {
    console.log('ERROR insertPhoto: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Remove a photo from the DB
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      return res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    console.log('ERROR deletePhoto: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {

  try {
    const { userId } = req.params;

    const user = await User.findById(mongoose.Types.ObjectId(userId));

    if (!user)  {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const followingUsers = user.following.filter((following) => following.isAccepted);
    const usersIds = followingUsers.map((user) => user.userId)
    
    usersIds.push(user._id);

    const photos = await Photo.find({
      "$or": [
        { "isPrivate": false },
        { "userId": { $in: usersIds } }
      ]
    })
      .sort([["createdAt", -1]])
      .exec();

    return res.status(200).json(photos);
  } catch (error) {
    console.log('ERROR getAllPhotos: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get user photos
const getUserPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    const photos = await Photo.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec();
  
    return res.status(200).json(photos);
  } catch (error) {
    console.log('ERROR getUserPhotos: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get photo by id
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));
  
    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }
  
    res.status(200).json(photo);
  } catch (error) {
    console.log('ERROR getPhotoById: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Update a photo
const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const { scientificContent } = req.body;

    let image;

    if (req.file) {
      image = req.file.filename;
    }

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      return res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
    }

    if (title) {
      photo.title = title;
    }

    if (image) {
      photo.image = image;
    }

    if (scientificContent){
      photo.scientificContent = scientificContent;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    console.log('ERROR updatePhoto: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Like functionality
const likePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const reqUser = req.user;
  
    const photo = await Photo.findById(id);
  
    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }
  
    // Check if user already liked the photo
    if (photo.likes.includes(reqUser._id)) {
      return res.status(422).json({ errors: ["Você já curtiu esta foto."] });
    }
  
    // Put user id in array of likes
    photo.likes.push(reqUser._id);
  
    await photo.save();
  
    res
      .status(200)
      .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" }); 
  } catch (error) {
    console.log('ERROR likePhoto: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Comment functionality
const commentPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }

    // Put comment in the array of comments
    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({
      comment: userComment,
      message: "Comentário adicionado com sucesso!",
    });
  } catch (error) {
    console.log('ERROR commentPhoto: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Search a photo by title
const searchPhotos = async (req, res) => {
  try {
    const { q } = req.query;

    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();
  
    res.status(200).json(photos);
  } catch (error) {
    console.log('ERROR searchPhotos: ', error.message);
    return res.status(500).json({
      message: error.message
    });  
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
