import userService from '../services/userService';

let handleLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Missing email or password',
            });
        }

        let data = await userService.handleUserLogin(email, password);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleGetUser = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing required parameter',
                listUsers: [],
            });
        }
        let listUsers = await userService.getUser(id);
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            listUsers,
        });
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleCreateUser = async (req, res) => {
    try {
        let data = req.body;
        let response = await userService.createNewUser(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleEditUser = async (req, res) => {
    try {
        let data = req.body;
        if (!data.email) {
            return res.status(200).json({
                errCode: 1,
                message: 'We need email of user to delete',
            });
        }
        let response = await userService.editInfoUser(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        let id = req.query.id;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                message: 'We need id of user to delete',
            });
        }
        let response = await userService.deleteUser(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const getAllCode = async (req, res) => {
    try {
        const type = req.query.type;
        if (type) {
            const data = await userService.handleGetAllCode(type);
            return res.status(200).json(data);
        } else {
            const data = {
                errCode: 1,
                message: 'Type is required',
            };
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

const search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (keyword) {
            const data = await userService.search(keyword);
            return res.status(200).json(data);
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Keyword is required',
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
    handleLogin,
    handleGetUser,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
    search,
};
