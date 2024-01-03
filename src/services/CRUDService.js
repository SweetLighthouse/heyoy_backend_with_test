import bcrypt from 'bcryptjs';
import db from '../models';
import { checkParamValid } from '../util/commonUtil';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValidObj = checkParamValid(data, [
                'email',
                'password',
                'firstName',
                'lastName',
                'birthday',
                'address',
                'phoneNumber',
                'gender',
                'image',
                'role',
            ]);
            if (isValidObj.isValid) {
                const regex =
                    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
                // Check email is exist
                let isEmailExist = await checkUserEmail(data.email);
                if (isEmailExist) {
                    resolve({
                        errCode: 1,
                        message: 'Email already exists',
                    });
                } else if (!regex.test(data.email)) {
                    resolve({
                        errCode: 3,
                        message: 'Email invalid',
                    });
                } else {
                    const saltRounds = 10;
                    let hashPasswordByBcrypt = await bcrypt.hashSync(data.password, saltRounds);
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordByBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        birthday: +data.birthday,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        image: data.image,
                        roleId: data.role,
                        positionId: data.position,
                    });
                    resolve({
                        errCode: 0,
                        message: 'Create user successfully',
                    });
                }
            } else {
                resolve({
                    errCode: 4,
                    message: `Missing parameters ${isValidObj.invalidElement}`,
                });
            }
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
