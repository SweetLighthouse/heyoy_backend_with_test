import specialtyService from '../services/specialtyService';

const handleCreateSpecialty = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await specialtyService.handleCreateSpecialty(data);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Data empty',
            });
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetQuantitySpecialty = async (req, res) => {
    try {
        let quantity = req.query.quantity;
        if (quantity) {
            let response = await specialtyService.handleGetQuantitySpecialty(quantity);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing id specialty',
            });
        }
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetDetailSpecialty = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let response = await specialtyService.handleGetDetailSpecialty(+id);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({ errCode: 1, message: 'Missing id of specialty' });
        }
    } catch (error) {
        return res.status(200).json({ errCode: -1, message: 'Error from server' });
    }
};

module.exports = {
    handleCreateSpecialty,
    handleGetQuantitySpecialty,
    handleGetDetailSpecialty,
};
