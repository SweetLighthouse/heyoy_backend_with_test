import db from '../models';
import CRUDService from '../services/CRUDService';
import userService from '../services/userService';
require('dotenv').config();

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (error) {
        console.log(error);
    }
};

let createUser = async (req, res) => {
    let response = await userService.handleGetAllCode('position');
    return res.render('createCrud.ejs', { data: response?.data });
};

let postCRUD = async (req, res) => {
    let response = await CRUDService.createNewUser(req.body);
    console.log(response);
    if (response?.errCode === 0) {
        return res.send('Create user successfully');
    } else {
        return res.send(response?.message ? response.message : 'Create user failed');
    }
};

let displayGetCRUD = async (req, res) => {
    let listUsers = await CRUDService.getAllUsers();
    return res.render('getCrud.ejs', { listUsers: listUsers });
};

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    let userData = await CRUDService.getUserById(userId);
    if (userData) {
        return res.render('editCrud.ejs', { userData: userData });
    } else {
        return res.send('Cannot find user');
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let listUsers = await CRUDService.updateUserData(data);
    if (listUsers) {
        return res.render('getCrud.ejs', { listUsers });
    } else {
        return res.send('Cannot update user');
    }
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    let listUsers = await CRUDService.deleteUserById(userId);
    if (listUsers) {
        return res.render('getCrud.ejs', { listUsers });
    } else {
        return res.send('Cannot update user');
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
