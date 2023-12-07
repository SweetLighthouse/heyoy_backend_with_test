import db from '../models';
import { checkParamValid } from '../util/commonUtil';
import { sendInvoiceAndRemedyEmail } from './emailService';

require('dotenv').config();

const handleQuantityGetDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = [];

            if (typeof limit === 'string' && limit?.toLowerCase() === 'all') {
                doctors = await db.User.findAll({
                    where: {
                        roleId: 'R2',
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
            } else {
                doctors = await db.User.findAll({
                    where: {
                        roleId: 'R2',
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    limit,
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
            }

            if (doctors?.length > 0) {
                resolve({
                    errCode: 0,
                    data: doctors,
                });
                return;
            }
            resolve({
                errCode: 1,
                message: 'Not found any doctor',
            });
        } catch (error) {
            reject(error);
        }
    });
};

const handleGetDoctorBySpecialtyAndProvince = (specialty, province) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof province === 'string' && province.toLowerCase() === 'all') {
                let listDoctors = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: ['id', 'firstName', 'lastName', 'image'],
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            where: { specialtyId: specialty },
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (listDoctors?.length > 0) {
                    resolve({
                        errCode: 0,
                        data: listDoctors,
                    });
                } else {
                    resolve({
                        errCode: 3,
                        message: 'No doctor found',
                    });
                }
            } else {
                let listDoctors = await db.User.findAll({
                    where: { roleId: 'R2' },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Doctor_Info,
                            where: { provinceId: province, specialtyId: specialty },
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
                if (listDoctors?.length > 0) {
                    resolve({
                        errCode: 0,
                        data: listDoctors,
                    });
                } else {
                    resolve({
                        errCode: 3,
                        message: 'No doctor found',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

const handleGetDoctorByClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Doctor_Info, where: { clinicId: id } },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true,
            });

            if (listDoctors?.length > 0) {
                resolve({
                    errCode: 0,
                    data: listDoctors,
                });
            } else {
                resolve({
                    errCode: 3,
                    message: 'No doctor found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const createDetailDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValidObj = checkParamValid(data, [
                'doctorId',
                'description',
                'contentMarkdown',
                'contentHTML',
                'priceId',
                'paymentId',
                'provinceId',
                'clinicId',
                'specialtyId',
            ]);

            if (isValidObj.isValid) {
                let doctorHasMarkdown = await db.Markdown.findOne({
                    where: { doctorId: data?.doctorId },
                    raw: false,
                });
                if (doctorHasMarkdown) {
                    doctorHasMarkdown.contentHTML = data.contentHTML;
                    doctorHasMarkdown.contentMarkdown = data.contentMarkdown;
                    doctorHasMarkdown.description = data.description;
                    doctorHasMarkdown.updatedAt = new Date();

                    await doctorHasMarkdown.save();
                } else {
                    await db.Markdown.create({
                        doctorId: data.doctorId,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                    });
                }

                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });

                if (doctorInfo) {
                    doctorInfo.update({
                        doctorId: data.doctorId,
                        priceId: data.priceId,
                        provinceId: data.provinceId,
                        paymentId: data.paymentId,
                        clinicId: data.clinicId,
                        note: data.note,
                        specialtyId: data.specialtyId,
                    });
                    await doctorInfo.save();
                } else {
                    await db.Doctor_Info.create({
                        doctorId: data.doctorId,
                        priceId: data.priceId,
                        provinceId: data.provinceId,
                        paymentId: data.paymentId,
                        clinicId: data.clinicId,
                        note: data.note,
                        specialtyId: data.specialtyId,
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'Save doctor detail succeed!',
                });
            } else {
                resolve({
                    errCode: 2,
                    message: `Missing parameter ${isValidObj.invalidElement}`,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getDetailDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['contentHTML', 'contentMarkdown', 'description'],
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Info,
                        attributes: ['priceId', 'provinceId', 'paymentId', 'clinicId', 'note', 'specialtyId'],
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address'] },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (doctor) {
                // doctor.image = new Buffer(doctor.image, 'base64').toString('binary');
                resolve({
                    errCode: 0,
                    data: doctor,
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'Doctor not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const handleSendInvoiceRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValidObj = checkParamValid(data, [
                'doctorId',
                'patientId',
                'date',
                'patientEmail',
                'patientFirstName',
                'patientLastName',
                'image',
                'timeType',
                'language',
            ]);
            if (isValidObj.isValid) {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();

                    await sendInvoiceAndRemedyEmail({
                        recipientEmail: data.patientEmail,
                        language: data.language,
                        patientLastName: data.patientLastName,
                        patientFirstName: data.patientFirstName,
                        image: data.image,
                    });

                    resolve({
                        errCode: 0,
                        message: 'OK',
                    });
                } else {
                    resolve({
                        errCode: 3,
                        message: 'No found appointment',
                    });
                    return;
                }
            } else {
                resolve({
                    errCode: 2,
                    message: `Missing required parameter ${isValidObj.invalidElement}`,
                });
                return;
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleQuantityGetDoctor,
    handleGetDoctorBySpecialtyAndProvince,
    handleGetDoctorByClinic,
    createDetailDoctor,
    getDetailDoctor,
    handleSendInvoiceRemedy,
};
