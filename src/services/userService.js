import db from '../models';
import bcrypt from 'bcryptjs';
import { checkParamValid } from '../util/commonUtil';
const { Op } = require('sequelize');

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
                        attributes: ['id', 'email', 'roleId', 'firstName', 'lastName', 'image'],
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
            if (typeof id === 'string' && id.toLowerCase() === 'all') {
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
            let isValidObj = checkParamValid(data, [
                'email',
                'password',
                'firstName',
                'lastName',
                'address',
                'phoneNumber',
                'gender',
                'birthday',
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
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        birthday: data.birthday,
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

let editInfoUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                    birthday: data.birthday,
                    image: data.image,
                    roleId: data.role,
                    positionId: data.position,
                    updatedAt: new Date(),
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

const handleGetAllCode = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await db.Allcode.findAll({
                where: { type },
            });
            resolve({
                errCode: 0,
                data: res,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const search = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};

            // search in specialty
            let listSpecialties = await db.Specialty.findAll({
                where: {
                    name: {
                        [Op.like]: `%${keyword || ''}%`,
                    },
                },
                attributes: ['id', 'name', 'image'],
            });
            if (listSpecialties?.length > 0) {
                data = {
                    ...data,
                    specialty: [...listSpecialties],
                };
            }

            // search in clinic
            let listClinics = await db.Clinic.findAll({
                where: {
                    name: {
                        [Op.like]: `%${keyword || ''}%`,
                    },
                },
                attributes: ['id', 'name', 'image'],
            });
            if (listClinics?.length > 0) {
                data = {
                    ...data,
                    clinic: [...listClinics],
                };
            }

            // search in doctor
            let listDoctors = await db.User.findAll({
                where: {
                    [Op.or]: {
                        firstName: { [Op.like]: `%${keyword || ''}%` },
                        lastName: { [Op.like]: `%${keyword || ''}%` },
                    },
                    roleId: 'R2',
                },
                attributes: ['id', 'firstName', 'lastName', 'image'],
                include: [{ model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }],
                raw: false,
                nest: true,
            });
            if (listDoctors?.length > 0) {
                data = {
                    ...data,
                    doctor: [...listDoctors],
                };
            }

            resolve({
                errCode: 0,
                data,
            });
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
    handleGetAllCode,
    search,
};
