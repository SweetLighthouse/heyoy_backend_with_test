import db from '../models';

const createExaminationSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data?.length > 0) {
                data.map((item) => {
                    item.maxNumber = +process.env.MAX_NUMBER;
                    return item;
                });

                let scheduleExisted = await db.Schedule.findAll({
                    where: {
                        doctorId: data[0].doctorId,
                        date: data[0].date,
                    },
                    attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
                });

                if (scheduleExisted?.length > 0) {
                    scheduleExisted = scheduleExisted.map((item) => {
                        item.date = new Date(item.date).getTime();
                        return item;
                    });
                }

                let toCreate = _.differenceWith(data, scheduleExisted, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });

                if (toCreate?.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'Data empty',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getExaminationSchedule = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listSchedules = await db.Schedule.findAll({
                where: {
                    doctorId,
                    date: +date,
                },
                include: [{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }],
                raw: false,
                nest: true,
            });
            if (listSchedules?.length > 0) {
                resolve({
                    errCode: 0,
                    data: listSchedules,
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'No find available schedules',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createExaminationSchedule,
    getExaminationSchedule,
};
