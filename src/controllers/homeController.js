import db from "../models";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

let createUser = (req, res) => {
  return res.render("createCrud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  return res.send("post user to database");
};

let displayGetCRUD = async (req, res) => {
  let listUsers = await CRUDService.getAllUsers();
  return res.render("getCrud.ejs", { listUsers: listUsers });
};

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  let userData = await CRUDService.getUserById(userId);
  if (userData) {
    return res.render("editCrud.ejs", { userData: userData });
  } else {
    return res.send("Cannot find user");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let listUsers = await CRUDService.updateUserData(data);
  if (listUsers) {
    return res.render("getCrud.ejs", { listUsers });
  } else {
    return res.send("Cannot update user");
  }
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
    let listUsers = await CRUDService.deleteUserById(userId);
    if (listUsers) {
      return res.render("getCrud.ejs", { listUsers });
    } else {
      return res.send("Cannot update user");
    }
};

module.exports = {
  getHomePage,
  createUser,
  postCRUD,
  displayGetCRUD,
  editCRUD,
  putCRUD,
  deleteCRUD,
};
