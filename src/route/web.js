import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import scheduleController from '../controllers/scheduleController'
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController'

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/create-crud', homeController.createUser);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // user
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-user', userController.handleGetUser);
    router.post('/api/create-user', userController.handleCreateUser);
    router.put('/api/update-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/get-all-code', userController.getAllCode);

    // doctor
    router.get('/api/get-quantity-doctor', doctorController.handleQuantityGetDoctor);
    router.get('/api/get-doctor-by-specialty-and-province', doctorController.handleGetDoctorBySpecialtyAndProvince);
    router.get('/api/get-doctor-by-clinic', doctorController.handleGetDoctorByClinic);
    router.post('/api/create-detail-doctor', doctorController.handleCreateDetailDoctor);
    router.get('/api/get-detail-doctor', doctorController.handleGetDetailDoctor);
    router.post('/api/send-invoice-remedy', doctorController.handleSendInvoiceRemedy);

    // schedule
    router.post('/api/create-examination-schedule', scheduleController.handleCreateExaminationSchedule);
    router.get('/api/get-examination-schedule', scheduleController.handleGetExaminationSchedule);

    // patient
    router.post('/api/patient-book-appointment', patientController.handlePostBookAppointment);
    router.post('/api/verify-book-appointment', patientController.handleVerifyBookAppointment);
    router.get('/api/get-patient-by-doctor-and-date', patientController.handleGetPatientByDoctorAndDate);
    router.get('/api/get-appointment-by-patient', patientController.handleGetAppointmentByPatient);

    // specialty
    router.post('/api/create-specialty', specialtyController.handleCreateSpecialty);
    router.get('/api/get-quantity-specialty', specialtyController.handleGetQuantitySpecialty);
    router.get('/api/get-detail-specialty', specialtyController.handleGetDetailSpecialty);

    // clinic
    router.post('/api/create-clinic', clinicController.handleCreateClinic);
    router.get('/api/get-quantity-clinic', clinicController.handleGetQuantityClinic);
    router.get('/api/get-detail-clinic', clinicController.handleGetDetailClinic);


    return app.use('/', router);
};

module.exports = initWebRoutes;
