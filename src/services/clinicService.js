const db = require('../models');
const { checkParamValid } = require('../util/commonUtil');

const handleCreateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValidObj = checkParamValid(data, [
                'name',
                'address',
                'descriptionHTML',
                'descriptionMarkdown',
                'image',
            ]);
            if (isValidObj.isValid) {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image,
                });
                resolve({
                    errCode: 0,
                    message: 'Create clinic successfully',
                });
            } else {
                resolve({
                    errCode: 2,
                    message: `Missing required ${isValidObj.invalidElement}`,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const handleGetQuantityClinic = (quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listClinics = [];
            if (typeof quantity === 'string' && quantity.toLowerCase() === 'all') {
                listClinics = await db.Clinic.findAll();
            } else {
                listClinics = await db.Clinic.findAll({
                    limit: +quantity,
                });
            }
            if (listClinics?.length > 0) {
                resolve({
                    errCode: 0,
                    data: listClinics,
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'No clinics found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const handleGetDetailClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findOne({ where: { id } });
            if (data) {
                resolve({
                    errCode: 0,
                    data,
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'No clinic found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleCreateClinic,
    handleGetQuantityClinic,
    handleGetDetailClinic,
};
