import patientService from '../services/patientService';

const handlePostBookAppointment = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await patientService.postBookAppointment(data);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing data',
            });
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server: ',
        });
    }
};

const handleVerifyBookAppointment = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await patientService.verifyAppointment(data);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing data',
            });
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server: ',
        });
    }
};

const handleGetPatientByDoctorAndDate = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        if (!doctorId) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing doctor id',
            });
        } else if (!date) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing date',
            });
        } else {
            let response = await patientService.handleGetPatientByDoctorAndDate(doctorId, date);
            return res.status(200).json(response);
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server: ',
        });
    }
};

const handleGetAppointmentByPatient = async (req, res) => {
    try {
        let patientId = req.query.patientId;
        if (patientId) {
            let response = await patientService.handleGetAppointmentByPatient(patientId);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing patient id',
            });
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    handlePostBookAppointment,
    handleVerifyBookAppointment,
    handleGetPatientByDoctorAndDate,
    handleGetAppointmentByPatient,
};
