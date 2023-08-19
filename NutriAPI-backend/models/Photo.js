const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    image              : String,
    title              : String,
    likes              : Array,
    comments           : Array,
    userId             : mongoose.ObjectId,
    userName           : String,
    userCRN            : String,
    userSubscription   : String,
    scientificContent  : String,
    isPrivate          : Boolean,
  },
  {
    timestamps: true,
  }
);

Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
