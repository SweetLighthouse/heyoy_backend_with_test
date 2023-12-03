import db from '../models';
import { checkParamValid } from '../util/commonUtil';

const handleCreateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValidObj = checkParamValid(data, []);
            if (isValidObj.isValid) {
                await db.Specialty.create({
                    name: data.name,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image,
                });
                resolve({
                    errCode: 0,
                    message: 'Create specialty successfully',
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

const handleGetQuantitySpecialty = (quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof quantity === 'string' && quantity.toLowerCase() == 'all') {
                let listSpecialty = await db.Specialty.findAll();
                resolve({
                    errCode: 0,
                    data: listSpecialty,
                });
            } else {
                let listSpecialty = await db.Specialty.findAll({
                    attributes: ['name', 'image'],
                    limit: +quantity,
                });
                resolve({
                    errCode: 0,
                    data: listSpecialty,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const handleGetDetailSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findOne({ where: { id } });
            if (data) {
                resolve({
                    errCode: 0,
                    data,
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "Couldn't find",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleCreateSpecialty,
    handleGetQuantitySpecialty,
    handleGetDetailSpecialty,
};
