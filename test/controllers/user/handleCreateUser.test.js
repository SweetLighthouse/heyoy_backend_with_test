import { handleCreateUser } from "../../../src/controllers/userController";
import userService from "../../../src/services/userService";

jest.mock("../../../src/services/userService");

describe('handleCreateUser', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {} };  // Reset body before each test
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    });

    it('nên trả về lỗi nếu thiếu tên hoặc email', async () => {
        req.body = { name: 'Some Name' };  // Missing email

        await handleCreateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);  // Bad Request for missing data
        expect(res.json).toHaveBeenCalledWith({
            errCode: 1,
            message: 'Name and email are required to create a user',
        });
    });

    it('nên tạo user thành công', async () => {
        req.body = { name: 'Some Name', email: 'someoneexample.com' };
        const mockResponse = { id: '123', name: 'Some Name', email: 'someoneexample.com' };
        userService.createNewUser.mockResolvedValue(mockResponse);

        await handleCreateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);  // Created status
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('nên trả về lỗi server', async () => {
        req.body = { name: 'Some Name', email: 'someoneexample.com' };
        userService.createNewUser.mockRejectedValue(new Error('Database error'));

        await handleCreateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);  // Internal server error
        expect(res.json).toHaveBeenCalledWith({
            errCode: -1,
            message: 'Error from server',
        });
    });
});