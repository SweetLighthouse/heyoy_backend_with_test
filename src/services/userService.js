import db from "../models";
import bcrypt from "bcryptjs";

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isEmailExist = await checkUserEmail(email);

      if (isEmailExist) {
        let isCorrectPassword = await compareUserPassword(email, password);
        if (isCorrectPassword) {
          userData.errCode = 0;
          userData.message = "OK";
          let userInfo = await db.User.findOne({
            where: { email },
            attributes: ["email", "roleId"],
          });
          userData.data = userInfo;
        } else {
          userData.errCode = 2;
          userData.errMessage = "Not correct password";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Email does not exist, please try again";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isEmailExist = await db.User.findOne({
        where: {
          email: userEmail,
        },
      });
      if (isEmailExist) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const compareUserPassword = (email, userPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataUser = await db.User.findOne({ where: { email: email } });
      let isCorrectPassword = bcrypt.compareSync(
        userPassword,
        dataUser.password
      );
      if (isCorrectPassword) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listUsers = [];
      if (id === "all") {
        listUsers = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      } else if (id) {
        listUsers = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(listUsers);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getUser,
};
