import clinicService from '../services/clinicService';

const handleCreateClinic = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await clinicService.handleCreateClinic(data);
            return res.status(200).json(response);
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

const handleGetQuantityClinic = async (req, res) => {
    try {
        let quantity = req.query.quantity;
        if (!quantity) {
            quantity = 8;
        }
        if (quantity) {
            let response = await clinicService.handleGetQuantityClinic(quantity);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing quantity',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetDetailClinic = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let response = await clinicService.handleGetDetailClinic(id);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing id clinic',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    handleCreateClinic,
    handleGetQuantityClinic,
    handleGetDetailClinic,
};
