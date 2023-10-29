import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing email or password",
    });
  }

  let data = await userService.handleUserLogin(email, password);
  return res.status(200).json(data);
};

let handleGetUser = async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameter",
      listUsers: [],
    });
  }
  let listUsers = await userService.getUser(id);
  return res.status(200).json({
    errCode: 0,
    message: "OK",
    listUsers,
  });
};

module.exports = {
  handleLogin,
  handleGetUser,
};
