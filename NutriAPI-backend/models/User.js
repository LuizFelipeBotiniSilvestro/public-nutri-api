const mongoose = require("mongoose");
const { Schema } = mongoose;


const follower = new Schema({
  userId         : mongoose.ObjectId,
  name           : String,
  email          : String,
  isAccepted     : {
    type: Boolean,
    default: false
  },
}, { _id : false });

const userSchema = new Schema(
  {
    name           : String,
    email          : String,
    password       : String,
    profileImage   : String,
    bio            : String,
    crn            : String,
    subscription   : String,
    isNutritionist : Boolean,
    followers      : [follower],
    following      : [follower]
  },
  {
    timestamps: true,
  }
);

User = mongoose.model("User", userSchema);

module.exports = User;
