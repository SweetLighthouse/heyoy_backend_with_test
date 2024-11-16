import { Sequelize } from 'sequelize';

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('medical_register', 'someuser1', '@12#$%65', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    port: 3311
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;
