const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const CrnService = require("../services/CrnService");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  try {
    const { name, email, password, isNutritionist, crn, subscription } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
    }

    // validar se a inscrição é válida!!!!!!!!!!!!!!!!!
    if (isNutritionist) {
      const validate = await CrnService.validate(crn, subscription);

      if (!validate) {
        return res.status(404).json({
          errors: ["CRN do Nutricionista não encontrado na nossa base de dados"],
        });
      }
    }

    // Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      isNutritionist,
      crn,
      subscription
    });

    // If user was created sucessfully, return the token
    if (!newUser) {
      return res.status(422).json({
        errors: ["Houve um erro, por favor tente novamente mais tarde."],
      });   
    }

    return res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id),
      isNutritionist: newUser.isNutritionist,
      following: [],
      followers: [],
    });
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get logged in user
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Sign user in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado!"] });
      return;
    }

    // Check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(422).json({ errors: ["Senha inválida!"] });
      return;
    }

    // Return user with token
    res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      token: generateToken(user._id),
      isNutritionist: user.isNutritionist,
      following: user.following,
      followers: user.followers
    });
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Update user
const update = async (req, res) => {
  try {
    const { name, password, bio, isNutritionist, crn, subscription} = req.body;

    let profileImage = null;

    if (req.file) {
      profileImage = req.file.filename;
    }

    const reqUser = req.user;

    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select(
      "-password"
    );

    if (name) {
      user.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    if (bio) {
      user.bio = bio;
    }

    if (isNutritionist) {
      user.isNutritionist = isNutritionist;
    }

    if (crn) {
      user.crn = crn;
    }

    if (subscription) {
      user.subscription = subscription;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get user by id
const getUserById = async (req, res) => {
 try {
    const { id } = req.params;

    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    // Check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado!"] });
      return;
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

// Get all Nutritionists
const getAll = async (req, res) => {
  try {
    const { isNutritionist } = req.query;
    const where = {};

    if (isNutritionist) where.isNutritionist = isNutritionist;

    const users = await User.find(where)
      .sort([["createdAt", -1]])
      .exec();

    return res.status(200).json(users);
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const { nutritionistId } = req.body;

    const nutritionist = await User.findById(mongoose.Types.ObjectId(nutritionistId));
    const user = await User.findById(mongoose.Types.ObjectId(id));

    if (!nutritionist || !user)  {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    nutritionist.followers.push({
      userId: id,
      name: user.name,
      email: user.email
    });

    user.following.push({
      userId: nutritionist._id,
      name: nutritionist.name,
      email: nutritionist.email
    });

    await nutritionist.save();
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.log('ERRO no updateFollowers: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
}

const acceptFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const nutritionist = await User.findById(mongoose.Types.ObjectId(id));
    const user = await User.findById(mongoose.Types.ObjectId(userId));

    if (!nutritionist || !user)  {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const userIndex = nutritionist.followers.findIndex((follower) => follower.userId == userId);
    const follower = nutritionist.followers[userIndex];
    follower.isAccepted = true;

    const nutritionistIndex = user.following.findIndex((following) => following.userId == id);
    const following = user.following[nutritionistIndex]
    following.isAccepted = true;

    await nutritionist.save();
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.log('ERROR: ', error.message);
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  register,
  getCurrentUser,
  login,
  update,
  getUserById,
  getAll,
  updateFollowers,
  acceptFollower,
};
