const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic: { type: String, unique: true },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
