import scheduleService from '../services/scheduleService';

const handleCreateExaminationSchedule = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let response = await scheduleService.createExaminationSchedule(data);
            return res.status(200).json(response);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Invalid data',
            });
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const handleGetExaminationSchedule = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;

        if (!doctorId || !date) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing doctorId or date',
            });
        } else {
            let data = await scheduleService.getExaminationSchedule(doctorId, date);
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    handleCreateExaminationSchedule,
    handleGetExaminationSchedule,
};
