import User from './User'
import LoginInformationDAL from "./LoginInformationDAL";
import {model} from "mongoose";
import bcrypt from "bcrypt-nodejs";

const cryptPassword = (password) =>
  new Promise((cryptSuccess, cryptError) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return cryptError(err);

      bcrypt.hash(password, salt, null, (err, hash) => cryptSuccess(hash));
    });
  });

const UserDAL = {
  registerUser: async function (user) {
    user.password = user.password && (await cryptPassword(user.password));

    return this.create(user);
  },

  findByUsername: function (username) {
    return this.findOne({
      username,
    })
  },
  getLastLogin: function (userId) {
    return LoginInformationDAL.findOne().sort({date: -1}).where({userId});
  },

  login: async function (info) {
    LoginInformationDAL.create({...info, date: new Date()});
  },
  findByEmailAndPassword: async function (email, password) {
    const user = await this.findOne({email});
    if (!user && !user.password)
      throw new Error(`Email: ${email}, is not registered!`);

    const match = bcrypt.compareSync(password, user.password);

    if (match) return user;
    else new Error("Password does not match");
  },

  findByFacebookId: async function (id) {
    return this.findOne({"facebookInformation.profileId": id});
  },

  findByGoogleProfileId: async function (id) {
    return this.findOne({"googleInformation.profileId": id});
  },

  findAll: async function () {
    return await this.find();
  }
}


export default model("User", User);
