'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Patient_Info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Patient_Info.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id' });
            Patient_Info.hasMany(models.Booking, { foreignKey: 'patientId' });
        }
    }
    Patient_Info.init(
        {
            patientId: DataTypes.INTEGER,
            profession: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Patient_Info',
        },
    );
    return Patient_Info;
};
