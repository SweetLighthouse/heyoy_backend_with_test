import bcrypt from 'bcryptjs';
import db from '../models';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
            });
            resolve('Create user successfully');
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listUsers = await db.User.findAll({ raw: true });
            resolve(listUsers);
        } catch (error) {
            reject(error);
        }
    });
};

let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findByPk(id, { raw: true });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findByPk(data.id);
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.updatedAt = new Date();
                await user.save();
                let listUsers = await db.User.findAll();
                resolve(listUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUserById = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findByPk(idUser);
            if (user) {
                await user.destroy();
                let listUsers = await db.User.findAll();
                resolve(listUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUserData,
    deleteUserById,
};
