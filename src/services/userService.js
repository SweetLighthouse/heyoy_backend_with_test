import db from '../models';
import bcrypt from 'bcryptjs';

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isEmailExist = await checkUserEmail(email);

            if (isEmailExist) {
                let isCorrectPassword = await compareUserPassword(email, password);
                if (isCorrectPassword) {
                    userData.errCode = 0;
                    userData.message = 'OK';
                    let userInfo = await db.User.findOne({
                        where: { email },
                        attributes: ['email', 'roleId'],
                    });
                    userData.data = userInfo;
                } else {
                    userData.errCode = 2;
                    userData.message = 'Not correct password';
                }
            } else {
                userData.errCode = 1;
                userData.message = 'Email does not exist, please try again';
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
            let isCorrectPassword = bcrypt.compareSync(userPassword, dataUser.password);
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
            if (id === 'all') {
                listUsers = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
            } else if (id) {
                listUsers = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }
            resolve(listUsers);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check email is exist
            if (!data.email || !data.password) {
                resolve({
                    errCode: 2,
                    message: 'Email and password are required',
                });
            }
            let isEmailExist = await checkUserEmail(data.email);
            if (isEmailExist) {
                resolve({
                    errCode: 1,
                    message: 'Email already exists',
                });
            } else {
                const saltRounds = 10;
                let hashPasswordByBcrypt = await bcrypt.hashSync(data.password, saltRounds);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordByBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    image: data.image,
                    roleId: data.roleId,
                    positionId: data.positionId,
                });
                resolve({
                    errCode: 0,
                    message: 'Create user successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let editInfoUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (!data.email) {
                resolve({
                    errCode: 2,
                    message: 'Email is required',
                });
                return;
            }
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: false,
            });
            if (user) {
                user.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    image: data.image,
                    roleId: data.roleId,
                    positionId: data.positionId,
                });
                await user.save();
                resolve({
                    errCode: 0,
                    message: "Update user's profile successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'User not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: id } });
            if (user) {
                await db.User.destroy({ where: { id: id } });
                resolve({
                    errCode: 0,
                    message: 'User deleted',
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'User not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin,
    getUser,
    createNewUser,
    editInfoUser,
    deleteUser,
};
