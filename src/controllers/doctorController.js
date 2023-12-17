import doctorService from '../services/doctorService';

const handleQuantityGetDoctor = async (req, res) => {
    try {
        let limit = req.query?.limit;

        if (!limit) {
            limit = 8;
        }
        if (typeof limit === 'string' && limit?.toLowerCase() === 'all') {
            let response = await doctorService.handleQuantityGetDoctor(limit);
            return res.status(200).json(response);
        }
        let response = await doctorService.handleQuantityGetDoctor(+limit);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetDoctorBySpecialtyAndProvince = async (req, res) => {
    try {
        let specialty = req.query?.specialty;
        let province = req.query?.province;
        if (specialty && province) {
            let response = await doctorService.handleGetDoctorBySpecialtyAndProvince(specialty, province);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing parameter province',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetDoctorByClinic = async (req, res) => {
    try {
        let id = req.query?.id;
        if (id) {
            let response = await doctorService.handleGetDoctorByClinic(+id);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing parameter province',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleCreateDetailDoctor = async (req, res) => {
    try {
        const data = req.body;
        if (data) {
            let doctors = await doctorService.createDetailDoctor(data);
            return res.status(200).json(doctors);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing data',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetDetailDoctor = async (req, res) => {
    try {
        let id = req.query.id;

        if (id) {
            let data = await doctorService.getDetailDoctor(+id);
            return res.status(200).json(data);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Doctor id is required',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleSendInvoiceRemedy = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await doctorService.handleSendInvoiceRemedy(data);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing data',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    handleQuantityGetDoctor,
    handleGetDoctorBySpecialtyAndProvince,
    handleGetDoctorByClinic,
    handleCreateDetailDoctor,
    handleGetDetailDoctor,
    handleSendInvoiceRemedy,
};
