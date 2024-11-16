import { handleGetUser } from "../../../src/controllers/userController";
import userService from "../../../src/services/userService";

// Mocking userService.getUser
jest.mock("../../../src/services/userService");

describe('handleGetUser', () => {
    let req;
    let res;

    // reset request và response với mỗi lần test
    beforeEach(() => {
        req = { query: {} }; 
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    });

    it('nên trả về lỗi nếu không có id', async () => {
        req.query.id = undefined; // No id provided

        await handleGetUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errCode: 1,
            message: 'Missing required parameter: id',
            listUsers: [],
        });
    });

    it('nên trả về danh sách user khi có id', async () => {
        req.query.id = '1';
        const mockUsers = [{ id: '1' }];
        userService.getUser.mockResolvedValue(mockUsers);

        await handleGetUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            errCode: 0,
            message: 'OK',
            listUsers: mockUsers,
        });
    });

    it('nên trả về lỗi server', async () => {
        req.query.id = '1';
        userService.getUser.mockRejectedValue(new Error('Database connection error'));

        await handleGetUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errCode: -1,
            message: 'Error from server',
        });
    });
});