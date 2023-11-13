import userService from '../services/userService';

let handleLogin = async (req, res) => {
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
};

let handleGetUser = async (req, res) => {
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
};

let handleCreateUser = async (req, res) => {
    let data = req.body;
    let message = await userService.createNewUser(data);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    if (!data.email) {
        return res.status(200).json({
            errCode: 1,
            message: 'We need email of user to delete',
        });
    }
    let message = await userService.editInfoUser(data);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'We need id of user to delete',
        });
    }
    let message = await userService.deleteUser(id);
    return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
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
};

module.exports = {
    handleLogin,
    handleGetUser,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
};
