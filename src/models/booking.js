'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.Patient_Info, { foreignKey: 'patientId', targetKey: 'patientId' });
            Booking.belongsTo(models.Doctor_Info, { foreignKey: 'doctorId', targetKey: 'doctorId' });
            Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeBookingData' });
            Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusBookingData' });

            Booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorUserData' });
        }
    }
    Booking.init(
        {
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.DATE,
            timeType: DataTypes.STRING,
            reason: DataTypes.TEXT,
            token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Booking',
        },
    );
    return Booking;
};
